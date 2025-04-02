<template>
  <div class="new-examination-page-auto">
    <h2>自动创建考试</h2>
    <el-form :model="examForm" label-width="120px">
      <el-form-item label="考试名称">
        <el-input v-model="examForm.name"></el-input>
      </el-form-item>
      <el-form-item label="题目数量">
        <el-input-number v-model="examForm.questionCount" :min="1" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item label="难度级别">
        <el-select v-model="examForm.difficultyLevel">
          <el-option label="简单" value="easy"></el-option>
          <el-option label="中等" value="medium"></el-option>
          <el-option label="困难" value="hard"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试时间（分钟）">
        <el-input-number v-model="examForm.duration" :min="1" :max="180"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createExamination">创建考试</el-button>
      </el-form-item>
    </el-form>
    <!-- 可以在这里添加创建考试的结果展示 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      examForm: {
        name: '', // 考试名称
        questionCount: 10, // 默认题目数量
        difficultyLevel: 'easy', // 默认难度级别
        duration: 60, // 默认考试时间（分钟）
      },
    };
  },
  methods: {
    createExamination() {
      // 这里应该调用创建考试的逻辑
      // 例如，通过API请求创建考试
      // 然后将结果展示在页面上或进行其他操作
      console.log('创建考试:', this.examForm);
      // 假设创建考试成功，可以在这里更新页面状态或展示结果
    },
  },
};
</script>

<style scoped>
.new-examination-page-auto {
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