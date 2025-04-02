<template>
  <div class="new-competition-page-auto">
    <h2>自动创建比赛</h2>
    <el-form :model="competitionForm" ref="competitionForm" label-width="120px">
      <el-form-item label="比赛名称">
        <el-input v-model="competitionForm.name"></el-input>
      </el-form-item>
      <el-form-item label="题目难度">
        <el-select v-model="competitionForm.difficulty">
          <el-option label="简单" value="easy"></el-option>
          <el-option label="中等" value="medium"></el-option>
          <el-option label="困难" value="hard"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="题目类型">
        <el-checkbox-group v-model="competitionForm.types">
          <el-checkbox label="选择题"></el-checkbox>
          <el-checkbox label="填空题"></el-checkbox>
          <el-checkbox label="简答题"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="题目数量">
        <el-input-number v-model="competitionForm.questionCount" :min="1" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createCompetition">创建比赛</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      competitionForm: {
        name: '',
        difficulty: 'easy',
        types: [],
        questionCount: 10,
      },
    };
  },
  methods: {
    createCompetition() {
      // 这里应该调用创建比赛的逻辑
      // 例如，通过API请求发送比赛参数并创建比赛
      // 然后处理响应，可能包括跳转页面或显示成功消息
      console.log('创建比赛参数:', this.competitionForm);
      // 假设创建比赛成功，可以在这里执行后续操作
    },
  },
};
</script>

<style scoped>
.new-competition-page-auto {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>