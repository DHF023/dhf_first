package com.example.common;

import cn.hutool.core.date.DateField;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.entity.User;
import com.example.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;

@Component
public class JwtTokenUtils {

    private static UserService staticUserService;
    private static final Logger log = LoggerFactory.getLogger(JwtTokenUtils.class);

    @Resource
    private UserService userService;

    @PostConstruct
    public void setUserService() {
        staticUserService = userService;
    }

    /**
     * 生成token
     */
    public static String genToken(String userId, String username, String sign, String userrole) {
        // 获取当前日期时间
        Date now = new Date();
        // 计算1年后的日期时间
        Date oneYearLater = DateUtil.offset(now, DateField.YEAR, 1);
        Integer power = 1;
        String subject = "Information";
        if ("ROLE_ADMIN".equals(userrole)) power = 2;
        return JWT.create().withAudience(userId) // 将 user id 保存到 token 里面,作为载荷
                .withClaim("username", username)
                .withClaim("power", power)
                .withClaim("sub", subject)
                .withExpiresAt(oneYearLater) // 1年后token过期
                .sign(Algorithm.HMAC256(sign)); // 以 password 作为 token 的密钥
    }

    /**
     * 获取当前登录的用户信息
     */
    public static User getCurrentUser() {
        String token = null;
        try {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            token = request.getHeader("token");
            if (StrUtil.isBlank(token)) {
                token = request.getParameter("token");
            }
            if (StrUtil.isBlank(token)) {
                log.error("获取当前登录的token失败， token: {}", token);
                return null;
            }
            // 解析token，获取用户的id
            String userId = JWT.decode(token).getAudience().get(0);
            return staticUserService.findById(Integer.valueOf(userId));
        } catch (Exception e) {
            log.error("获取当前登录的用户信息失败, token={}", token,  e);
            return null;
        }
    }
}
