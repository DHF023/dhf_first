<template>
  <div>
    <div style="display: flex; justify-content: center;">
      <div class="table">
        <el-table :data="competitionProblems" border v-if="!loading">
          <!-- 题目列表部分保持不变 -->
          <el-table-column prop="problem_id" label="#" width="130"></el-table-column>
          <el-table-column prop="problem_title" label="标题">
            <template v-slot="scope">
              <a href="javascript:void(0);" @click="openCompetitionProblemDetail(scope.row.problem_id)" class="title-link">{{ scope.row.problem_title }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="solved_count" label="已解出" width="130"></el-table-column>
        </el-table>
        <div v-else class="loading">加载中...</div>
      </div>
    </div>

    <!-- 新增比赛信息展示部分 -->
    <div v-if="!loading && competitionInfo" class="contest-info">
      <div><strong>举办人员:</strong> {{ competitionInfo.holder_name }}</div>
      <div><strong>开始时间:</strong> {{ competitionInfo.start_time }}</div>
      <div><strong>结束时间:</strong> {{ competitionInfo.end_time }}</div>
      <div><strong>比赛信息:</strong> {{ competitionInfo.information }}</div>
    </div>
    <div v-else-if="error" class="error">{{ error.message }}</div>
  </div>
</template>

<script>
import newRequest from '@/utils/newRequest';

export default {
  name: 'CompetitionProblemList',
  data() {
    return {
      competitionProblems: [],
      competitionInfo: null, // 新增数据属性来存储比赛信息
      id: this.$route.params.id,
      loading: true,
      error: null
    };
  },
  methods: {
    fetchCompetitionProblems() {
      newRequest.get(`/api/contest/getinfo/${this.id}`)
          .then(response => {
            // 存储比赛信息
            this.competitionInfo = {
              holder_name: response.holder_name,
              start_time: response.start_time,
              end_time: response.end_time,
              information: response.information
            };

            // 假设响应数据中包含problem_ids字段，但题目详情需另行获取（此处简化处理）
            const problems = response.problem_ids.map(problem_id => ({
              problem_id,
              problem_title: `题目${problem_id}`, // 假设题目标题
              solved_count: 0 // 假设已解出数量
            }));
            this.competitionProblems = problems;
            this.loading = false;
          })
          .catch(error => {
            this.error = error;
            this.loading = false;
            console.error('Failed to fetch competition info and problems:', error);
          });
    },
    openCompetitionProblemDetail(problemId) {
      const contestId = this.$route.params.id; // 获取当前比赛ID
      const url = `/competition/${contestId}/competition-problem/${problemId}`;
      window.open(url, '_blank'); // 在新窗口打开对应题目页面
    }
  },
  watch: {
    // 监听路由变化，更新比赛ID并重新获取题目列表和比赛信息
    '$route'(to) {
      this.id = to.params.id;
      this.fetchCompetitionProblems();
    }
  },
  mounted() {
    // 组件挂载时获取题目列表和比赛信息
    this.fetchCompetitionProblems();
  }
};
</script>

<style scoped>
.table {
  width: 80%;
  margin: 30px 0;
}

.title-link {
  text-decoration: none; /* 去掉下划线 */
  color: #dba800; /* 更改字体颜色 */
}

.loading {
  text-align: center;
  margin-top: 20px;
}

.contest-info {
  margin-top: 20px;
  background-color: #ffffff;
  width: 500px;
  margin-left: 100px;
}

.contest-info div {
  margin-bottom: 10px;
}

.error {
  text-align: center;
  margin-top: 20px;
  color: red;
}
</style>