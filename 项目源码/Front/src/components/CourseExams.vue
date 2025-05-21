<template>
  <div class="course-exams">
    <h2>课程考试</h2>
    <el-table :data="exams" style="width: 100%">
      <el-table-column prop="name" label="考试名称"></el-table-column>
      <el-table-column prop="date" label="考试日期"></el-table-column>
      <el-table-column prop="location" label="考试地点"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === '已结束' ? 'info' : 'primary'">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="viewExam(scope.row)">
            <span style="color: #333;">详情</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CourseExams',
  props: ['courseId'],
  data() {
    return {
      exams: [
        { id: 1, name: '期中考试', date: '2023-04-15', location: '教学楼201', status: '已结束' },
        { id: 2, name: '期末考试', date: '2023-06-20', location: '教学楼301', status: '未开始' }
      ]
    }
  },
  methods: {
    viewExam(exam) {
      // TODO: 跳转到考试详情
    }
  },
  created() {
    // TODO: 根据courseId获取考试列表
  }
}
</script>

<style scoped>
.course-exams {
  padding: 20px;
}
</style>
