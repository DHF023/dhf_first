package com.example.entity;

import javax.persistence.*;
import java.util.Set;
import java.util.HashSet;

@Table(name = "course_schedule")
public class CourseSchedule {

    @ManyToMany
    @JoinTable(
        name = "course_student",
        joinColumns = @JoinColumn(name = "course_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "student_id", referencedColumnName = "id")
    )
    private Set<User> classMembers = new HashSet<>();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "teacher_id", referencedColumnName = "id")
    private User teacher;

    @Transient
    private Integer teacherId;

    @Column(name = "week_day")
    private Integer weekDay;

    @Column(name = "section")
    private Integer section;

    @Column(name = "classroom")
    private String classroom;

    @Column(name = "start_week")
    private Integer startWeek;

    @Column(name = "end_week")
    private Integer endWeek;

    @Column(name = "type")
    private Integer type;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getTeacher() {
        return teacher;
    }

    public void setTeacher(User teacher) {
        this.teacher = teacher;
    }

    public Integer getTeacherId() {
        return teacher != null ? teacher.getId() : null;
    }

    public void setTeacherId(Integer teacherId) {
        if (teacher == null) {
            teacher = new User();
        }
        teacher.setId(teacherId);
    }

    public Integer getWeekDay() {
        return weekDay;
    }

    public void setWeekDay(Integer weekDay) {
        this.weekDay = weekDay;
    }

    public Integer getSection() {
        return section;
    }

    public void setSection(Integer section) {
        this.section = section;
    }

    public String getClassroom() {
        return classroom;
    }

    public void setClassroom(String classroom) {
        this.classroom = classroom;
    }

    public Integer getStartWeek() {
        return startWeek;
    }

    public void setStartWeek(Integer startWeek) {
        this.startWeek = startWeek;
    }

    public Integer getEndWeek() {
        return endWeek;
    }

    public void setEndWeek(Integer endWeek) {
        this.endWeek = endWeek;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Set<User> getClassMembers() {
        return classMembers;
    }

    public void setClassMembers(Set<User> classMembers) {
        this.classMembers = classMembers;
    }
}
