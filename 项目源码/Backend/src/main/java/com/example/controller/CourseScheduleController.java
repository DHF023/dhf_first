package com.example.controller;

import com.example.common.Result;
import com.example.entity.CourseSchedule;
import com.example.service.CourseScheduleService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/courseSchedule")
public class CourseScheduleController {

    @Resource
    private CourseScheduleService courseScheduleService;

    @PostMapping("/add")
    public Result add(@RequestBody CourseSchedule courseSchedule) {
        try {
            courseScheduleService.add(courseSchedule);
            return Result.success();
        } catch (IllegalArgumentException e) {
            return Result.error(e.getMessage());
        } catch (Exception e) {
            return Result.error("添加课程失败，请稍后再试");
        }
    }

    @PutMapping("/update")
    public Result update(@RequestBody CourseSchedule courseSchedule) {
        try {
            courseScheduleService.update(courseSchedule);
            return Result.success();
        } catch (IllegalArgumentException e) {
            return Result.error(e.getMessage());
        } catch (Exception e) {
            return Result.error("更新课程失败，请稍后再试");
        }
    }

    @DeleteMapping("/delete/{id}")
    public Result delete(@PathVariable Integer id) {
        try {
            courseScheduleService.deleteById(id);
            return Result.success();
        } catch (IllegalArgumentException e) {
            return Result.error(e.getMessage());
        } catch (Exception e) {
            return Result.error("删除课程失败，请稍后再试");
        }
    }

    @GetMapping("/find/{id}")
    public Result findById(@PathVariable Integer id) {
        try {
            return Result.success(courseScheduleService.findById(id));
        } catch (IllegalArgumentException e) {
            return Result.error(e.getMessage());
        } catch (Exception e) {
            return Result.error("查询课程详情失败");
        }
    }

    @GetMapping("/list")
    public Result findAll() {
        try {
            List<CourseSchedule> list = courseScheduleService.findAll();
            return Result.success(list);
        } catch (Exception e) {
            return Result.error("获取课程列表失败");
        }
    }

    @GetMapping("/findByTeacher/{teacherId}")
    public Result findByTeacherId(@PathVariable Integer teacherId) {
        try {
            List<CourseSchedule> list = courseScheduleService.findByTeacherId(teacherId);
            return Result.success(list);
        } catch (IllegalArgumentException e) {
            return Result.error(e.getMessage());
        } catch (Exception e) {
            return Result.error("查询教师课程失败");
        }
    }

    @GetMapping("/findByTime")
    public Result findByWeekDayAndSection(
            @RequestParam Integer weekDay,
            @RequestParam Integer section) {
        try {
            List<CourseSchedule> list = courseScheduleService.findByWeekDayAndSection(weekDay, section);
            return Result.success(list);
        } catch (IllegalArgumentException e) {
            return Result.error(e.getMessage());
        } catch (Exception e) {
            return Result.error("按时间查询课程失败");
        }
    }

    @PostMapping("/addStudent")
    public Result addStudentToClass(
            @RequestParam Integer courseId,
            @RequestParam Integer studentId) {
        try {
            courseScheduleService.addStudentToClass(courseId, studentId);
            return Result.success();
        } catch (IllegalArgumentException e) {
            return Result.error(e.getMessage());
        } catch (IllegalStateException e) {
            return Result.error(e.getMessage());
        } catch (Exception e) {
            return Result.error("系统繁忙，请稍后再试");
        }
    }

    @PostMapping("/removeStudent")
    public Result removeStudentFromClass(
            @RequestParam Integer courseId,
            @RequestParam Integer studentId) {
        try {
            courseScheduleService.removeStudentFromClass(courseId, studentId);
            return Result.success();
        } catch (IllegalArgumentException e) {
            return Result.error(e.getMessage());
        } catch (IllegalStateException e) {
            return Result.error(e.getMessage());
        } catch (Exception e) {
            return Result.error("移除学生失败，请稍后再试");
        }
    }

    @GetMapping("/classStudents/{courseId}")
    public Result getClassStudents(@PathVariable Integer courseId) {
        try {
            return Result.success(courseScheduleService.getClassStudents(courseId));
        } catch (IllegalArgumentException e) {
            return Result.error(e.getMessage());
        } catch (Exception e) {
            return Result.error("获取班级学生列表失败");
        }
    }
}
