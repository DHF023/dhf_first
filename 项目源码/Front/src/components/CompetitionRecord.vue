<template>
  <div class="table-wrapper">
    <!-- 表格外层容器，用于Flexbox布局和水平居中 -->
    <div class="table-container">
      <el-table
        :data="submissions"
        border
        v-loading="loading"
        element-loading-text="加载中..."
      >
        <!-- 表格列定义 -->
        <el-table-column prop="submission_id" label="提交ID" width="60"></el-table-column>
        <el-table-column prop="problem_id" label="题目ID" width="60"></el-table-column>
        <el-table-column prop="user_id" label="用户ID" width="180"></el-table-column>
        <el-table-column prop="language" label="编程语言" width="120"></el-table-column>
        <el-table-column prop="submit_time" label="提交时间" width="220"></el-table-column>
        <el-table-column prop="status" label="状态" width="120"></el-table-column>
        <el-table-column prop="time_used" label="耗时(ms)" width="80"></el-table-column>
        <el-table-column prop="memory_used" label="内存使用(MB)" width="100"></el-table-column>
        <template #empty>
          <el-empty description="暂无提交记录"></el-empty>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
import newRequest from '@/utils/newRequest';

export default {
  name: 'CompetitionRecord', // 组件名称
  data() {
    return {
      id: this.$route.params.id, // 当前比赛ID，从路由参数获取
      submissions: [], // 提交记录列表
      loading: true, // 加载状态
      error: null // 错误信息
    };
  },
  methods: {
    fetchSubmissions() {
      // 获取提交记录
      newRequest.get(`/api/contest/get_all_submission/${this.id}`)
          .then(response => {
            this.submissions = response; // 更新提交记录列表
            this.loading = false; // 加载完成
          })
          .catch(error => {
            this.error = error; // 设置错误信息
            this.loading = false; // 加载完成
            console.error('Failed to fetch submissions:', error); // 输出错误信息到控制台
          });
    }
  },
  watch: {
    '$route'(to) {
      // 监听路由变化，更新比赛ID并重新获取提交记录
      this.id = to.params.id;
      this.fetchSubmissions();
    }
  },
  mounted() {
    // 组件挂载时获取提交记录
    this.fetchSubmissions();
  }
};
</script>

<style scoped>
.loading, .error {
  text-align: center;
  margin-top: 20px;
}

.error {
  color: red;
}

.table-wrapper {
  display: flex;
  justify-content: center; /* 水平居中整个表格容器 */
  width: 100%; /* 确保外层容器占据全宽 */
  margin: 30px 0;
  overflow-x: auto; /* 允许表格水平滚动 */
}

.table-container {
  width: auto; /* 使容器宽度自适应表格内容 */
}
</style>