<template>
  <div class="course-detail">
    <div class="main-container">
      <h1>{{ course.name }}</h1>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="课程主页" name="home">
          <el-card>
            <h2>课程信息</h2>
            <p><i class="el-icon-user"></i> 授课教师：{{ course.teacher }}</p>
            <p><i class="el-icon-time"></i> 上课时间：{{ course.time }}</p>
            <p><i class="el-icon-location"></i> 上课地点：{{ course.location }}</p>
            <p><i class="el-icon-collection-tag"></i> 课程类型：{{ course.type === 0 ? '必修' : '选修' }}</p>
            <p><i class="el-icon-user-solid"></i> 班级人数：{{ course.studentCount }}人</p>
            <p><i class="el-icon-document"></i> 课程简介：{{ course.description }}</p>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="班级成员" name="members">
          <class-members :course-id="courseId"></class-members>
        </el-tab-pane>
        <el-tab-pane label="课程作业" name="assignments">
          <course-assignments :course-id="courseId"></course-assignments>
        </el-tab-pane>
        <el-tab-pane label="课程考试" name="exams">
          <course-exams :course-id="courseId"></course-exams>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import ClassMembers from './ClassMembers.vue'
import CourseAssignments from './CourseAssignments.vue'
import CourseExams from './CourseExams.vue'

export default {
  name: 'CourseDetail',
  components: {
    ClassMembers,
    CourseAssignments,
    CourseExams
  },
  data() {
    return {
      courseId: this.$route.params.courseId,
      activeTab: 'home',
      loading: false,
      course: {
        id: null,
        name: '',
        teacher: '',
        weekDay: null,
        section: null,
        classroom: '',
        type: 0,
        description: '',
        studentCount: 0,
        time: '',
        location: '',
        teacherInfo: {}
      }
    }
  },
  watch: {
    '$route'(to) {
      this.activeTab = to.params.tabName || 'home'
      this.courseId = to.params.courseId
      this.fetchCourseDetail()
    }
  },
  created() {
    this.activeTab = this.$route.params.tabName || 'home'
    this.fetchCourseDetail()
  },
  methods: {
    async fetchCourseDetail() {
      this.loading = true
      try {
        // 并行获取课程基本信息和班级人数
        const [courseRes, countRes] = await Promise.all([
          request.get(`/courseSchedule/find/${this.courseId}`),
          request.get(`/courseSchedule/classStudents/${this.courseId}`)
        ])

        if (courseRes.code !== '0') {
          throw new Error(courseRes.msg || '获取课程信息失败')
        }

        const courseData = courseRes.data
        let teacherInfo = { name: '未知教师' }

        // 获取教师详细信息
        if (courseData.teacher?.id) {
          const teacherRes = await request.get(`/user/${courseData.teacher.id}`)
          if (teacherRes.code === '0') {
            teacherInfo = teacherRes.data
          }
        }

        this.course = {
          id: courseData.id,
          name: courseData.name,
          teacher: teacherInfo.name,
          weekDay: courseData.weekDay,
          section: courseData.section,
          classroom: courseData.classroom,
          type: courseData.type,
          description: courseData.description || '暂无课程描述',
          studentCount: countRes.code === '0' ? countRes.data.length : 0,
          time: courseData.weekDay && courseData.section ?
            `周${['日','一','二','三','四','五','六'][courseData.weekDay]} 第${courseData.section}节` : '未设置',
          location: courseData.classroom || '未设置',
          teacherInfo: teacherInfo
        }

      } catch (error) {
        console.error('获取课程详情失败:', error)
        this.$message.error(error.message || '获取课程详情失败')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.course-detail {
  min-height: calc(100vh - 60px);
  overflow: auto;
  padding: 20px 0;
  display: flex;
  justify-content: center;
}

.main-container {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  width: 70%;
  padding: 20px;
}

.el-tabs {
  margin: 15px;
}

.el-card {
  margin: 15px 0;
}

@media (max-width: 768px) {
  .main-container {
    width: 95%;
  }
}
</style>
