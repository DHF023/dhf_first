<template>
  <div class="course-assignments">
    <h2>课程作业</h2>
    <el-table :data="assignments" style="width: 100%">
      <el-table-column prop="title" label="作业名称"></el-table-column>
      <el-table-column prop="deadline" label="截止日期"></el-table-column>
      <el-table-column prop="status" label="完成状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === '已完成' ? 'success' : 'warning'">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="viewAssignment(scope.row)">
            <span style="color: #333;">查看</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CourseAssignments',
  props: ['courseId'],
  data() {
    return {
      assignments: [
        { id: 1, title: 'Vue基础练习', deadline: '2023-06-15', status: '已完成' },
        { id: 2, title: 'React项目', deadline: '2023-06-20', status: '进行中' }
      ]
    }
  },
  methods: {
    viewAssignment(assignment) {
      // TODO: 跳转到作业详情
    }
  },
  created() {
    // TODO: 根据courseId获取作业列表
  }
}
</script>

<style scoped>
.course-assignments {
  padding: 20px;
}
</style>
