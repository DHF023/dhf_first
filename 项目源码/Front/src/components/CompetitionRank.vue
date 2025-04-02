<template>
  <div class="table-wrapper">
    <div class="ranking-table">
      <el-table :data="rankingList" border v-if="!loading && !error">
        <el-table-column prop="rank" label="#" width="50"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="solved_count" label="=" width="50"></el-table-column>
        <el-table-column prop="penalty" label="罚时" width="75"></el-table-column>

        <!-- 动态生成题目列 -->
        <el-table-column
            v-for="problem_id in problemIds"
            :key="problem_id"
            :label="problem_id"
            width="65"
        >
          <template v-slot="scope">
            {{ scope.row.problem_scores[problem_id] || '未提交' }}
          </template>
        </el-table-column>

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
      rankingList: [],
      problemIds: [], // 用于存储题目ID列表
      loading: true,
      error: null
    };
  },
  methods: {
    fetchRanking() {
      // 假设接口同时返回排行榜和题目ID列表
      newRequest.get(`/api/contest/getinfo/${this.id}`)
        .then(response => {
          this.rankingList = response.ranklist || [];
          this.problemIds = response.problem_ids || []; // 从响应中获取题目ID列表
          this.loading = false;
        })
        .catch(error => {
          this.error = error;
          this.loading = false;
          console.error('Failed to fetch ranking and problem IDs:', error);
        });
    }
  },
  watch: {
    // 监听路由变化，更新比赛ID并重新获取排名列表
    '$route'(to) {
      this.id = to.params.id;
      this.fetchRanking();
    }
  },
  mounted() {
    // 组件挂载时获取排名列表和题目ID列表
    this.fetchRanking();
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

.ranking-table {
  width: auto; /* 使表格宽度自适应内容，或根据需要设置固定宽度 */
}
</style>