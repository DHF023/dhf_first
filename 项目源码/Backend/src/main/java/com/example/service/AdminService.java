package com.example.service;


import com.example.common.JwtTokenUtils;
import com.example.dao.AdminDao;
import com.example.entity.Admin;
import com.example.entity.Params;
import com.example.exception.CustomException;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class AdminService {

    @Resource
    private AdminDao adminDao;

    public Admin login(Admin admin) {
        // 1. 进行一些非空判断
        // 检查用户名是否为空
        if (admin.getName() == null || "".equals(admin.getName())) {
            throw new CustomException("用户名不能为空");
        }
        // 检查密码是否为空
        if (admin.getPassword() == null || "".equals(admin.getPassword())) {
            throw new CustomException("密码不能为空");
        }

        // 2. 从数据库里面根据这个用户名和密码去查询对应的管理员信息，
        Admin user = adminDao.findByNameAndPassword(admin.getName(), admin.getPassword());
        // 如果查出来没有，那说明输入的用户名或者密码有误，提示用户，不允许登录
        if (user == null) {
            throw new CustomException("用户名或密码输入错误");
        }

        // 如果查出来了有，那说明确实有这个管理员，而且输入的用户名和密码都对；
        // 生成jwt token给前端
        String token = JwtTokenUtils.genToken(user.getId().toString(), user.getName(), user.getPassword(), user.getRole());
        user.setToken(token);
        return user;
    }


    public List<Admin> findAll() {
        // 返回所有管理员信息
        return adminDao.selectAll();
    }


    public PageInfo<Admin> findBySearch(Params params) {
        // 开启分页查询
        PageHelper.startPage(params.getPageNum(), params.getPageSize());
        // 接下来的查询会自动按照当前开启的分页设置来查询
        // 执行查询操作，获取满足条件的Admin列表
        List<Admin> list = adminDao.findBySearch(params);
        // 将查询结果转换为PageInfo对象
        return PageInfo.of(list);
    }


    public void add(Admin admin) {
        // 1. 用户名一定要有，否则不让新增（后面需要用户名登录）
        // 检查用户名是否为空
        if (admin.getName() == null || "".equals(admin.getName())) {
            throw new CustomException("用户名不能为空");
        }

        // 2. 进行重复性判断，同一名字的管理员不允许重复新增：只要根据用户名去数据库查询一下就可以了
        // 根据用户名去数据库查询
        Admin user = adminDao.findByName(admin.getName());
        // 判断查询结果是否为空
        if (user != null) {
            // 说明已经有了，这里我们就要提示前台不允许新增了
            throw new CustomException("该用户名已存在，请更换用户名");
        }

        // 初始化一个密码
        // 检查密码是否为空
        if (admin.getPassword() == null || "".equals(admin.getPassword())) {
            // 设置默认密码
            admin.setPassword("123456");
        }

        // 检查角色是否为空
        if (admin.getRole() == null || "".equals(admin.getRole())) {
            // 设置默认角色
            admin.setRole("学生");
        }

        // 将管理员信息插入数据库
        adminDao.insertSelective(admin);
    }


    public void update(Admin admin) {
        // 更新管理员信息
        adminDao.updateByPrimaryKeySelective(admin);
    }

    public void delete(Integer id) {
        // 删除指定ID的管理员
        adminDao.deleteByPrimaryKey(id);
    }

    public Admin findByById(Integer id) {
        // 根据ID查找管理员
        return adminDao.selectByPrimaryKey(id);
    }

}
