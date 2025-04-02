<template>
  <div class="table-wrapper"> <!-- 使用新的容器类名 -->
    <div class="table-container"> <!-- 保持原有的容器，用于Flexbox布局 -->
      <el-table :data="submissions" v-if="!loading && !error" border> <!-- 添加border属性以匹配样式 -->
        <!-- 表格列保持不变 -->
        <el-table-column prop="submission_id" label="提交ID" width="60"></el-table-column>
        <el-table-column prop="problem_id" label="题目ID" width="60"></el-table-column>
        <el-table-column prop="user_id" label="用户ID" width="180"></el-table-column>
        <el-table-column prop="language" label="编程语言" width="120"></el-table-column>
        <el-table-column prop="submit_time" label="提交时间" width="220"></el-table-column>
        <el-table-column prop="status" label="状态" width="120"></el-table-column>
        <el-table-column prop="time_used" label="耗时(ms)" width="80"></el-table-column>
        <el-table-column prop="memory_used" label="内存使用(MB)" width="100"></el-table-column>
      </el-table>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-if="error" class="error">{{ error.message }}</div>
    </div>
  </div>
</template>

<script>
import newRequest from '@/utils/newRequest';

export default {
  name: 'CompetitionRank',
  data() {
    return {
      id: this.$route.params.id,
      submissions: [],
      loading: true,
      error: null
    };
  },
  methods: {
    fetchSubmissions() {
      // 使用newRequest发起请求
      newRequest.get(`/api/contest/get_all_submission/${this.id}`)
          .then(response => {
            // 由于newRequest的response拦截器已经处理了响应数据，这里直接获取data
            this.submissions = response;
            this.loading = false;
          })
          .catch(error => {
            this.error = error;
            this.loading = false;
            console.error('Failed to fetch submissions:', error);
          });
    }
  },
  watch: {
    // 监听路由变化，更新比赛ID并重新获取提交记录
    '$route'(to) {
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
}

.table-container {
  width: auto; /* 使容器宽度自适应表格内容，或根据需要设置固定宽度 */
}

</style>