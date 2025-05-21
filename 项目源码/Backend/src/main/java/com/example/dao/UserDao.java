package com.example.dao;

import com.example.entity.User;
import com.example.entity.Params;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

@Repository
public interface UserDao extends Mapper<User> {

    List<User> findBySearch(@Param("params") Params params);

    @Select("select * from user where name = #{name} limit 1")
    User findByName(@Param("name") String name);

    /**
     * 根据ID查询用户
     * @param id 用户ID
     * @return 用户对象
     */
    default User selectById(Integer id) {
        return selectByPrimaryKey(id);
    }

    @Select("select u.* from user u " +
            "inner join course_student cs on u.id = cs.student_id " +
            "where cs.course_id = #{courseId}")
    List<User> selectByCourseId(@Param("courseId") Integer courseId);
}
