package com.example.controller;

import com.example.common.Result;
import com.example.entity.Admin;
import com.example.entity.Params;
import com.example.service.AdminService;
import com.github.pagehelper.PageInfo;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Resource
    private AdminService adminService;


    @PostMapping("/login")
    public Result login(@RequestBody Admin admin) {
        // 调用adminService的login方法，传入admin对象进行登录验证
        // 返回登录验证后的admin对象
        Admin loginUser = adminService.login(admin);
        // 返回登录成功的Result对象，包含登录验证后的admin对象
        return Result.success(loginUser);
    }


    @PostMapping("/register")
    public Result register(@RequestBody Admin admin) {
        // 调用adminService的add方法，将admin对象添加到系统中
        adminService.add(admin);
        // 返回注册成功的结果
        return Result.success();
    }


    @PostMapping
    public Result save(@RequestBody Admin admin) {
        // 判断管理员ID是否为空
        if (admin.getId() == null) {
            // 如果为空，则添加管理员
            adminService.add(admin);
        } else {
            // 如果不为空，则更新管理员
            adminService.update(admin);
        }
        // 返回操作成功的结果
        return Result.success();
    }


    @DeleteMapping("/{id}")
    // 定义一个删除接口，URL中包含一个路径变量{id}
    public Result delete(@PathVariable Integer id) {
        // 调用adminService的delete方法，传入路径变量id
        adminService.delete(id);
        // 返回操作成功的Result对象
        return Result.success();
    }


    @DeleteMapping("/batchDelete")
    public Result batchDelete(@RequestBody List<Integer> ids) {
        adminService.batchDelete(ids);
        return Result.success();
    }


    @GetMapping
    public Result findAll() {
        // 调用adminService的findAll方法获取所有的Admin列表
        List<Admin> list = adminService.findAll();
        // 返回包含所有Admin列表的成功结果
        return Result.success(list);
    }


    @GetMapping("/search")
    public Result findBySearch(Params params) {
        // 调用adminService的findBySearch方法，传入params参数，返回PageInfo<Admin>类型的结果
        PageInfo<Admin> info = adminService.findBySearch(params);
        // 返回成功的Result对象，包含info作为数据
        return Result.success(info);
    }

    @PostMapping("/sendVerificationCode")
    public Result sendVerificationCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean isSent = adminService.sendVerificationCode(email);
        return isSent ? Result.success("验证码已发送至您的邮箱") : Result.error("邮箱不存在或发送失败");
    }

    @PostMapping("/validateVerificationCode")
    public Result validateVerificationCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        boolean isValid = adminService.validateVerificationCode(email, code);
        return isValid ? Result.success("验证码正确") : Result.error("验证码错误");
    }

    @PostMapping("/resetPassword")
    public Result resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");
        boolean isReset = adminService.resetPassword(email, newPassword);
        return isReset ? Result.success("密码重置成功") : Result.error("密码重置失败");
    }

    @GetMapping("/{id}/username")
    public Result findUsernameById(@PathVariable Integer id) {
        // 调用 adminService 的方法，通过 ID 查找用户名
        String username = adminService.findUsernameById(id);

        // 检查是否找到了用户名
        if (username == null) {
            // 如果没有找到，返回错误信息
            return Result.error("未找到对应用户名");
        } else {
            // 如果找到了，返回成功信息和用户名
            return Result.success(username);
        }
    }
}
