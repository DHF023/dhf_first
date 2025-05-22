<template>
  <div class="course-list">
    <div class="course-container">
      <h1>{{ pageTitle }}</h1>
      <div v-if="isTeacher" class="add-course">
        <el-button type="primary" icon="el-icon-plus" @click="showAddDialog = true">
          添加课程
        </el-button>
      </div>
      <el-row :gutter="20">
        <el-col v-for="course in courses" :key="course.id" :span="8" style="margin-bottom: 20px;">
          <el-card shadow="hover" @click.native="goCourseDetail(course.id)"
                   style="cursor: pointer; height: 100%;" :body-style="{ padding: '0px' }">
            <div class="course-cover" :class="isTeacher ? 'teacher-cover' : 'student-cover'">
              <h3>{{ course.name }}</h3>
            </div>
            <div class="course-content">
              <p><i class="el-icon-user"></i> 教师：{{ course.teacher || '未设置' }}</p>
              <p><i class="el-icon-time"></i> 时间：{{ course.time || '未设置' }}</p>
              <p><i class="el-icon-location"></i> 地点：{{ course.location || '未设置' }}</p>
              <p><i class="el-icon-collection-tag"></i> 类型：{{ course.type === 0 ? '必修' : '选修' }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'CourseList',
  data() {
    return {
      courses: [],
      showAddDialog: false,
      loading: false,
      isTeacher: JSON.parse(localStorage.getItem('user'))?.power === 2
    }
  },
  computed: {
    pageTitle() {
      return this.isTeacher ? '我的课程' : '可选课程'
    }
  },
  created() {
    this.fetchCourses()
  },
  methods: {
    goCourseDetail(courseId) {
      const base = this.$router.options.base || '/'
      const url = this.$router.mode === 'hash'
        ? `${window.location.origin}${base}#/course/${courseId}`
        : `${window.location.origin}${base}course/${courseId}`
      window.open(url, '_blank', 'noopener,noreferrer')
    },
    async fetchCourses() {
      this.loading = true
      try {
        const params = {
          teacherId: this.isTeacher ? JSON.parse(localStorage.getItem('user')).id : null
        }
        const res = await request.get('/courseSchedule/list', { params })
        if (res.code === '0') {
          // 获取所有教师ID
          const teacherIds = [...new Set(res.data
            .map(course => course.teacher?.id)
            .filter(Boolean))]

          // 批量获取教师信息
          const teachers = {}
          await Promise.all(teacherIds.map(async id => {
            const teacherRes = await request.get(`/user/${id}`)
            if (teacherRes.code === '0') {
              teachers[id] = teacherRes.data.name
            }
          }))

          // 构建课程数据
          this.courses = res.data.map(course => ({
            ...course,
            time: course.weekDay && course.section ?
              `周${['日','一','二','三','四','五','六'][course.weekDay]} 第${course.section}节` : null,
            location: course.classroom || null,
            teacher: course.teacher?.id ? teachers[course.teacher.id] || '未知教师' : '未设置'
          }))
        }
      } catch (error) {
        console.error('获取课程列表失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.course-list {
  min-height: calc(100vh - 60px);
  padding: 20px 0;
  display: flex;
  justify-content: center;
}

.course-container {
  width: 80%;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

.course-cover {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.teacher-cover {
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
}

.student-cover {
  background: linear-gradient(to right, #43e97b 0%, #38f9d7 100%);
}

.course-content {
  padding: 15px;
}

.add-course {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .course-container {
    width: 95%;
  }
}
</style>
