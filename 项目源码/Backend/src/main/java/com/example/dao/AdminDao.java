package com.example.dao;


import com.example.entity.Admin;
import com.example.entity.Params;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;


@Repository
public interface AdminDao extends Mapper<Admin> {

    List<Admin> findBySearch(@Param("params") Params params);

    @Select("select * from admin where name = #{name} limit 1")
    Admin findByName(@Param("name") String name);

    @Select("select * from admin where name = #{name} and password = #{password} limit 1")
    Admin findByNameAndPassword(@Param("name") String name, @Param("password") String password);

    @Select("SELECT * FROM admin WHERE email = #{email}")
    Admin findByEmail(@Param("email") String email);

    @Update("UPDATE admin SET password = #{password} WHERE email = #{email}")
    void updatePasswordByEmail(@Param("email") String email, @Param("password") String password);

}

