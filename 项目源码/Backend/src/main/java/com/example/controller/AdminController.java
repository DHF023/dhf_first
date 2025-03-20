package com.example.controller;

import com.example.common.Result;
import com.example.entity.Admin;
import com.example.entity.Params;
import com.example.service.AdminService;
import com.github.pagehelper.PageInfo;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import java.util.List;

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

}
