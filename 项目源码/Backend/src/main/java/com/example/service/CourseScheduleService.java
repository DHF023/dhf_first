package com.example.service;

import com.example.entity.CourseSchedule;
import com.example.entity.User;
import java.util.List;
import java.util.Set;

public interface CourseScheduleService {
    void add(CourseSchedule courseSchedule);
    void update(CourseSchedule courseSchedule);
    void deleteById(Integer id);
    CourseSchedule findById(Integer id);
    List<CourseSchedule> findAll();
    List<CourseSchedule> findByTeacherId(Integer teacherId);
    List<CourseSchedule> findByWeekDayAndSection(Integer weekDay, Integer section);

    void addStudentToClass(Integer courseId, Integer studentId);
    void removeStudentFromClass(Integer courseId, Integer studentId);
    Set<User> getClassStudents(Integer courseId);
}
