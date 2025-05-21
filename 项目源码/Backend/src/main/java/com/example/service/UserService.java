package com.example.service;

import com.example.common.JwtTokenUtils;
import com.example.entity.User;
import com.example.entity.Params;
import com.example.exception.CustomException;
import com.github.pagehelper.PageInfo;

import java.util.List;
import java.util.Map;

public interface UserService {
    User login(User user);
    List<User> findAll();
    PageInfo<User> findBySearch(Params params);
    void add(User user);
    void update(User user);
    void delete(Integer id);
    void batchDelete(List<Integer> ids);
    User findById(Integer id);
    String findUsernameById(Integer id);
}
