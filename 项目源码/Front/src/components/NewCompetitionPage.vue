<template>
  <div class="new-competition-page">
    <h2>创建新比赛</h2>
    <el-form :model="competitionForm" :rules="rules" ref="competitionForm" label-width="120px">
      <el-form-item label="比赛名称" prop="name">
        <el-input v-model="competitionForm.name"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="competitionForm.startTime"
          type="datetime"
          placeholder="选择开始时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="competitionForm.endTime"
          type="datetime"
          placeholder="选择结束时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="题目数量" prop="questionCount">
        <el-input-number v-model="competitionForm.questionCount" :min="1" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('competitionForm')">提交</el-button>
        <el-button @click="resetForm('competitionForm')">重置</el-button>
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
        startTime: '',
        endTime: '',
        questionCount: 10,
      },
      rules: {
        name: [
          { required: true, message: '比赛名称不能为空', trigger: 'blur' },
        ],
        startTime: [
          { required: true, message: '开始时间不能为空', trigger: 'change' },
        ],
        endTime: [
          { required: true, message: '结束时间不能为空', trigger: 'change' },
          { validator: this.validateEndTime, trigger: 'change' }
        ],
        questionCount: [
          { type: 'number', required: true, message: '题目数量必须为数字', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单逻辑，例如通过API发送数据
          console.log('提交的比赛信息:', this.competitionForm);
          // 可以在这里添加提交成功后的逻辑，比如跳转页面或显示提示信息
        } else {
          console.log('表单验证失败');
          // 可以在这里添加表单验证失败后的逻辑，比如显示错误信息
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    validateEndTime(rule, value, callback) {
      if (!value) {
        callback(new Error('结束时间不能为空'));
      } else if (new Date(value) <= new Date(this.competitionForm.startTime)) {
        callback(new Error('结束时间必须晚于开始时间'));
      } else {
        callback();
      }
    },
  },
};
</script>

<style scoped>
.new-competition-page {
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