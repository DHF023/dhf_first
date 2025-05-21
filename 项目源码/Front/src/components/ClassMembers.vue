<template>
  <div class="class-members">
    <h2>班级成员</h2>
    <el-table v-loading="loading" :data="members" style="width: 100%">
      <el-table-column prop="name" label="姓名" width="150"></el-table-column>
      <el-table-column prop="work_id" label="学号" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'ClassMembers',
  props: ['courseId'],
  data() {
    return {
      loading: false,
      members: []
    }
  },
  created() {
    this.fetchClassMembers()
  },
  methods: {
    async fetchClassMembers() {
      this.loading = true
      try {
        const res = await request.get(`/courseSchedule/classStudents/${this.courseId}`)
        if (res.code === '0') {
          // 确保res.data是数组且每个元素包含id字段
          const studentIds = Array.isArray(res.data) ?
            res.data.map(item => item?.id || item) : []

          this.members = await Promise.all(studentIds.map(async studentId => {
            try {
              // 确保studentId是字符串或数字
              const validId = String(studentId).trim()
              if (!validId) return {
                name: '无效学生ID',
                work_id: '未设置',
                email: '未设置'
              }

              const userRes = await request.get(`/user/${validId}`)
              if (userRes.code === '0') {
                return {
                  name: userRes.data.name || '未知学生',
                  work_id: userRes.data.work_id || '未设置',
                  email: userRes.data.email || '未设置'
                }
              }
              return {
                name: '未知学生',
                work_id: '未设置',
                email: '未设置'
              }
            } catch (err) {
              console.error('获取学生信息失败:', err)
              return {
                name: '获取失败',
                work_id: '未设置',
                email: '未设置'
              }
            }
          }))
        } else {
          this.$message.error(res.msg || '获取班级成员失败')
        }
      } catch (error) {
        console.error('获取班级成员失败:', error)
        this.$message.error('获取班级成员失败: ' + error.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.class-members {
  padding: 20px;
}
</style>
