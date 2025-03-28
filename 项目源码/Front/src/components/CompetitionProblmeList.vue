<template>
  <div>
    <div style="display: flex; justify-content: center;">
      <div class="table">
        <el-table :data="competitionProblems" border>
          <el-table-column prop="id" label="#" width="130"></el-table-column>
          <el-table-column prop="title" label="标题">
            <template v-slot="scope">
              <a href="javascript:void(0);" @click="openCompetitionProblemDetail(scope.row.id)" class="title-link">{{ scope.row.title }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="已解出" width="130"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { competitionProblems } from "@/data/competition-problems.js";
import { competition } from "@/data/competition.js";

export default {
  name: 'CompetitionProblemList',
  data() {
    return {
      competitionProblems: competitionProblems,
      id: this.$route.params.id,
    };
  },
  computed: {
    competition() {
      return competition.find(c => c.id === this.id);
    },
  },
  methods: {
    openCompetitionProblemDetail(competitionProblemId) {
      this.$router.push({ name: 'CompetitionProblemDetail', params: { id: competitionProblemId } });
    },
  },
};
</script>

<style scoped>
.table {
  width: 80%;
  margin: 30px 0;
}

.title-link {
  text-decoration: none; /* 去掉下划线 */
  color: #dba800; /* 更改字体颜色，这里以绿色为例 */
}
</style>