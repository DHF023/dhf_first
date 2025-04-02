<template>
  <div class="new-homework-page">
    <el-form :model="homeworkForm" ref="homeworkForm" label-width="100px">
      <el-form-item label="作业标题" prop="title" :rules="{ required: true, message: '作业标题不能为空', trigger: 'blur' }">
        <el-input v-model="homeworkForm.title"></el-input>
      </el-form-item>

      <el-form-item label="作业描述" prop="description">
        <el-input type="textarea" v-model="homeworkForm.description"></el-input>
      </el-form-item>

      <el-form-item label="题目列表">
        <div v-for="(question, index) in homeworkForm.questions" :key="index" class="question-item">
          <el-input v-model="question.content" placeholder="请输入题目内容"></el-input>
          <el-button type="danger" icon="el-icon-delete" @click="removeQuestion(index)" circle></el-button>
        </div>
        <el-button type="primary" @click="addQuestion">添加题目</el-button>
      </el-form-item>

      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitHomework">提交作业</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'NewHomeworkPage',
  data() {
    return {
      homeworkForm: {
        title: '',
        description: '',
        questions: []
      }
    };
  },
  methods: {
    addQuestion() {
      this.homeworkForm.questions.push({ content: '' });
    },
    removeQuestion(index) {
      this.homeworkForm.questions.splice(index, 1);
    },
    cancel() {
      // 实现取消逻辑，比如返回上一页或清空表单
      this.$router.push({ name: 'Homework' }); // 假设有一个名为'Homework'的路由
    },
    submitHomework() {
      this.$refs.homeworkForm.validate(valid => {
        if (valid) {
          // 实现提交逻辑，比如发送请求到服务器
          console.log('提交作业:', this.homeworkForm);
          // 提交成功后可以跳转或显示成功消息
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.new-homework-page {
  padding: 20px;
}

.question-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.question-item .el-input {
  flex: 1;
  margin-right: 10px;
}
</style>