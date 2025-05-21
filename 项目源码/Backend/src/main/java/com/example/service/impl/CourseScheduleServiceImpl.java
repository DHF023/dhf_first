package com.example.service.impl;

import com.example.dao.CourseScheduleDao;
import com.example.dao.UserDao;
import com.example.entity.CourseSchedule;
import com.example.entity.User;
import com.example.service.CourseScheduleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
public class CourseScheduleServiceImpl implements CourseScheduleService {

    @Resource
    private CourseScheduleDao courseScheduleDao;

    @Resource
    private UserDao userDao;

    @Override
    public void add(CourseSchedule courseSchedule) {
        courseScheduleDao.insert(courseSchedule);
    }

    @Override
    public void update(CourseSchedule courseSchedule) {
        courseScheduleDao.update(courseSchedule);
    }

    @Override
    public void deleteById(Integer id) {
        courseScheduleDao.deleteById(id);
    }

    @Override
    public CourseSchedule findById(Integer id) {
        return courseScheduleDao.selectById(id);
    }

    private static final Logger logger = LoggerFactory.getLogger(CourseScheduleServiceImpl.class);

    @Override
    public List<CourseSchedule> findAll() {
        try {
            logger.debug("开始查询所有课程数据...");
            long startTime = System.currentTimeMillis();

            List<CourseSchedule> courses = courseScheduleDao.selectAll();
            logger.debug("原始查询结果: {}", courses);

            if (courses == null) {
                logger.error("查询返回null结果");
                throw new IllegalStateException("查询结果为空");
            }
            if (courses.isEmpty()) {
                logger.warn("查询到0条课程记录");
            } else {
                logger.info("成功查询到{}条课程记录", courses.size());
            }

            logger.debug("查询耗时: {}ms", System.currentTimeMillis() - startTime);
            return courses;

        } catch (Exception e) {
            logger.error("查询课程列表异常", e);
            throw new RuntimeException("查询课程列表失败: " + e.getMessage(), e);
        }
    }

    @Override
    public List<CourseSchedule> findByTeacherId(Integer teacherId) {
        return courseScheduleDao.selectByTeacherId(teacherId);
    }

    @Override
    public List<CourseSchedule> findByWeekDayAndSection(Integer weekDay, Integer section) {
        return courseScheduleDao.selectByWeekDayAndSection(weekDay, section);
    }

    private void validateCourseAndStudent(Integer courseId, Integer studentId) {
        if (courseId == null || studentId == null) {
            throw new IllegalArgumentException("课程ID和学生ID不能为空");
        }
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void addStudentToClass(Integer courseId, Integer studentId) {
        validateCourseAndStudent(courseId, studentId);
        CourseSchedule course = courseScheduleDao.selectById(courseId);
        User student = userDao.selectById(studentId);

        if (course == null) {
            throw new IllegalArgumentException("课程不存在");
        }
        if (student == null) {
            throw new IllegalArgumentException("学生不存在");
        }
        if (!"student".equals(student.getRole())) {
            throw new IllegalArgumentException("该用户不是学生角色");
        }
        if (course.getClassMembers().contains(student)) {
            throw new IllegalStateException("该学生已在班级中");
        }

        course.getClassMembers().add(student);
        courseScheduleDao.update(course);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void removeStudentFromClass(Integer courseId, Integer studentId) {
        validateCourseAndStudent(courseId, studentId);
        CourseSchedule course = courseScheduleDao.selectById(courseId);
        User student = userDao.selectById(studentId);

        if (course == null) {
            throw new IllegalArgumentException("课程不存在");
        }
        if (student == null) {
            throw new IllegalArgumentException("学生不存在");
        }
        if (!course.getClassMembers().contains(student)) {
            throw new IllegalStateException("该学生不在班级中");
        }

        course.getClassMembers().remove(student);
        courseScheduleDao.update(course);
    }

    @Override
    public Set<User> getClassStudents(Integer courseId) {
        if (courseId == null) {
            throw new IllegalArgumentException("课程ID不能为空");
        }

        CourseSchedule course = courseScheduleDao.selectById(courseId);
        return course != null ? course.getClassMembers() : Collections.emptySet();
    }
}
