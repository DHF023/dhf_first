package com.example.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.common.JwtTokenUtils;
import com.example.dao.UserDao;
import com.example.entity.User;
import com.example.entity.Params;
import com.example.exception.CustomException;
import com.example.service.UserService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class UserServiceImpl implements UserService {
    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    @Resource
    private UserDao userDao;

    public User login(User user) {
        if (user.getName() == null || "".equals(user.getName())) {
            throw new CustomException("用户名不能为空");
        }
        if (user.getPassword() == null || "".equals(user.getPassword())) {
            throw new CustomException("密码不能为空");
        }

        User dbUser = userDao.findByName(user.getName());
        if (dbUser == null) {
            throw new CustomException("用户名或密码输入错误");
        }

        // 验证密码(直接比对)
        if (!user.getPassword().equals(dbUser.getPassword())) {
            throw new CustomException("用户名或密码输入错误");
        }

        // 使用用户原始密码作为token签名
        String token = JwtTokenUtils.genToken(dbUser.getId().toString(), dbUser.getName(), dbUser.getPassword(), dbUser.getRole());
        dbUser.setToken(token);

        return dbUser;
    }

    public List<User> findAll() {
        return userDao.selectAll();
    }

    public PageInfo<User> findBySearch(Params params) {
        PageHelper.startPage(params.getPageNum(), params.getPageSize());
        List<User> list = userDao.findBySearch(params);
        return PageInfo.of(list);
    }

    public void add(User user) {
        if (user.getName() == null || "".equals(user.getName())) {
            throw new CustomException("用户名不能为空");
        }

        User dbUser = userDao.findByName(user.getName());
        if (dbUser != null) {
            throw new CustomException("该用户名已存在，请更换用户名");
        }

        if (user.getPassword() == null || "".equals(user.getPassword())) {
            user.setPassword("123456");
        }

        if (user.getRole() == null || "".equals(user.getRole())) {
            user.setRole("学生");
        }

        userDao.insertSelective(user);
    }

    public void update(User user) {
        userDao.updateByPrimaryKeySelective(user);
    }

    public void delete(Integer id) {
        userDao.deleteByPrimaryKey(id);
    }

    public void batchDelete(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }

        for (Integer id : ids) {
            userDao.deleteByPrimaryKey(id);
        }
    }

    public User findById(Integer id) {
        return userDao.selectByPrimaryKey(id);
    }


    public String findUsernameById(Integer id) {
        User user = userDao.selectByPrimaryKey(id);
        if (user == null) {
            return null;
        }
        return user.getName();
    }
}
