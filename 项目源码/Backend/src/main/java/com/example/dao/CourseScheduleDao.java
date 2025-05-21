package com.example.dao;

import com.example.entity.CourseSchedule;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseScheduleDao {

    void insert(CourseSchedule courseSchedule);

    void update(CourseSchedule courseSchedule);

    void deleteById(Integer id);

    CourseSchedule selectById(Integer id);

    List<CourseSchedule> selectAll();

    List<CourseSchedule> selectByTeacherId(@Param("teacherId") Integer teacherId);

    List<CourseSchedule> selectByWeekDayAndSection(
        @Param("weekDay") Integer weekDay,
        @Param("section") Integer section);
}
