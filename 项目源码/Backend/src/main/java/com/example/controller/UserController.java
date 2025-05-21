package com.example.controller;

import com.example.common.Result;
import com.example.entity.User;
import com.example.entity.Params;
import com.example.service.UserService;
import com.github.pagehelper.PageInfo;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {

    @Resource
    private UserService userService;

    @PostMapping("/login")
    public Result login(@RequestBody User user) {
        User loginUser = userService.login(user);
        return Result.success(loginUser);
    }

    @PostMapping("/register")
    public Result register(@RequestBody User user) {
        userService.add(user);
        return Result.success();
    }

    @PostMapping
    public Result save(@RequestBody User user) {
        if (user.getId() == null) {
            userService.add(user);
        } else {
            userService.update(user);
        }
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        userService.delete(id);
        return Result.success();
    }

    @DeleteMapping("/batchDelete")
    public Result batchDelete(@RequestBody List<Integer> ids) {
        userService.batchDelete(ids);
        return Result.success();
    }

    @GetMapping
    public Result findAll() {
        List<User> list = userService.findAll();
        return Result.success(list);
    }

    @GetMapping("/search")
    public Result findBySearch(Params params) {
        PageInfo<User> info = userService.findBySearch(params);
        return Result.success(info);
    }

    @GetMapping("/{id}")
    public Result findUserById(@PathVariable Integer id) {
        User user = userService.findById(id);
        if (user == null) {
            return Result.error("未找到对应用户");
        } else {
            return Result.success(user);
        }
    }
}
