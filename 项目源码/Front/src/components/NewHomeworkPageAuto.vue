<template>
  <div class="new-homework-page-auto">
    <h2>自动随机出题</h2>
    <el-form :model="form" label-width="120px">
      <el-form-item label="题目数量">
        <el-input-number v-model="form.questionCount" :min="1" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item label="难度级别">
        <el-select v-model="form.difficultyLevel">
          <el-option label="简单" value="easy"></el-option>
          <el-option label="中等" value="medium"></el-option>
          <el-option label="困难" value="hard"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="generateHomework">生成作业</el-button>
      </el-form-item>
    </el-form>
    <!-- 可以在这里添加生成作业的结果展示 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        questionCount: 10, // 默认题目数量
        difficultyLevel: 'easy', // 默认难度级别
      },
    };
  },
  methods: {
    generateHomework() {
      // 这里应该调用生成作业的逻辑
      // 例如，通过API请求获取随机题目
      // 然后将结果展示在页面上
      console.log('生成作业:', this.form);
      // 假设生成作业成功，可以在这里更新页面状态或展示结果
    },
  },
};
</script>

<style scoped>
.new-homework-page-auto {
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