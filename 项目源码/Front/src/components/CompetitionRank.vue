<template>
  <div class="table-wrapper">
    <div class="ranking-table">
      <el-table
        :data="rankingList"
        border
        v-loading="loading"
        element-loading-text="加载中..."
      >
        <template #empty>
          <el-empty description="暂无榜单数据"></el-empty>
        </template>
        <el-table-column prop="rank" label="#" width="50"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="solved_count" label="解决数" width="50"></el-table-column>
        <el-table-column prop="penalty" label="罚时" width="75"></el-table-column>

        <!-- 动态生成题目列，根据题目ID显示对应分数或“未提交” -->
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
    </div>
  </div>
</template>

<script>
import newRequest from '@/utils/newRequest';

export default {
  name: 'CompetitionRank',
  data() {
    return {
      id: this.$route.params.id, // 当前比赛ID
      rankingList: [], // 排名列表
      problemIds: [], // 题目ID列表
      loading: true, // 加载状态
      error: null // 错误信息
    };
  },
  methods: {
    fetchRanking() {
      // 获取排名列表和题目ID列表
      newRequest.get(`/api/contest/getinfo/${this.id}`)
        .then(response => {
          this.rankingList = response.ranklist || []; // 更新排名列表
          this.problemIds = response.problem_ids || []; // 更新题目ID列表
          this.loading = false; // 加载完成
        })
        .catch(error => {
          this.error = error; // 设置错误信息
          this.loading = false; // 加载完成
          console.error('Failed to fetch ranking and problem IDs:', error); // 输出错误信息到控制台
        });
    }
  },
  watch: {
    '$route'(to) {
      // 监听路由变化，更新比赛ID并重新获取排名列表
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
  justify-content: center; /* 使表格水平居中 */
  width: 100%; /* 设置外层容器宽度为100% */
  margin: 30px 0;
}

.ranking-table {
  width: auto; /* 表格宽度自适应内容 */
}
</style>