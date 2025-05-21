<template>
  <div>
    <div style="display: flex; justify-content: center;">
      <div class="table">
        <el-table
          :data="competitionProblems"
          border
          v-loading="loading"
          element-loading-text="加载中..."
        >
          <template #empty>
            <el-empty description="暂无题目数据"></el-empty>
          </template>
          <el-table-column prop="problem_id" label="#" width="130"></el-table-column>
          <el-table-column prop="problem_title" label="标题">
            <template v-slot="scope">
              <a href="javascript:void(0);" @click="openCompetitionProblemDetail(scope.row.problem_id)" class="title-link">{{ scope.row.problem_title }}</a>
            </template>
          </el-table-column>
          <el-table-column label="完成情况" width="130">
            <template v-slot="scope">
              <span v-if="solvedProblems.includes(scope.row.problem_id)">已完成</span>
              <span v-else></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div v-if="!loading && competitionInfo" class="contest-info">
      <div><strong>主办方:</strong> {{ competitionInfo.holder_name }}</div>
      <div><strong>开始时间:</strong> {{ competitionInfo.start_time }}</div>
      <div><strong>结束时间:</strong> {{ competitionInfo.end_time }}</div>
      <div><strong>比赛信息:</strong> {{ competitionInfo.information }}</div>
    </div>
  </div>
</template>

<script>
import newRequest from '@/utils/newRequest';

export default {
  name: 'CompetitionProblemList',
  data() {
    return {
      competitionProblems: [], // 比赛题目列表
      competitionInfo: null, // 比赛信息
      id: this.$route.params.id, // 当前比赛ID
      loading: true, // 加载状态
      error: null, // 错误信息
      solvedProblems: [], // 用户已解决的题目列表
    };
  },
  methods: {
    fetchCompetitionProblems() {
      // 获取比赛信息和题目列表
      newRequest.get(`/api/contest/getinfo/${this.id}`)
          .then(response => {
            this.competitionInfo = {
              holder_name: response.holder_name,
              start_time: response.start_time,
              end_time: response.end_time,
              information: response.information
            };

            const problems = response.problem_ids.map(problem_id => ({
              problem_id,
              problem_title: `题目${problem_id}`
            }));
            this.competitionProblems = problems;

            // 获取用户已解决的题目列表
            return newRequest.post(`/api/contest/get_contest_user_solved_problem/${this.id}`);
          })
          .then(solvedResponse => {
            this.solvedProblems = solvedResponse;
            console.log('已解决的题目列表:', this.solvedProblems);
            this.loading = false;
          })
          .catch(error => {
            this.error = error;
            this.loading = false;
            console.error('Failed to fetch competition info, problems, or solved problems:', error);
          });
    },
    openCompetitionProblemDetail(problemId) {
      const contestId = this.$route.params.id; // 获取当前比赛ID
      const url = `/competition/${contestId}/competition-problem/${problemId}`;
      window.open(url, '_blank'); // 在新窗口打开对应题目页面
    }
  },
  watch: {
    '$route'(to) {
      // 监听路由变化，更新比赛ID并重新获取题目列表和比赛信息
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
  color: #dba800; /* 更改字体颜色为金色 */
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