<template>
  <div class="new-examination-page">
    <h2>创建新考试</h2>
    <el-form :model="examinationForm" ref="examinationForm" label-width="120px">
      <el-form-item label="考试名称" prop="name" :rules="{ required: true, message: '考试名称不能为空', trigger: 'blur' }">
        <el-input v-model="examinationForm.name"></el-input>
      </el-form-item>
      <el-form-item label="考试科目" prop="subject" :rules="{ required: true, message: '考试科目不能为空', trigger: 'change' }">
        <el-select v-model="examinationForm.subject" placeholder="请选择科目">
          <el-option label="数学" value="math"></el-option>
          <el-option label="物理" value="physics"></el-option>
          <el-option label="化学" value="chemistry"></el-option>
          <!-- 可以根据需要添加更多科目选项 -->
        </el-select>
      </el-form-item>
      <el-form-item label="考试时间" prop="time" :rules="{ required: true, message: '考试时间不能为空', trigger: 'blur' }">
        <el-date-picker
          v-model="examinationForm.time"
          type="datetime"
          placeholder="选择考试时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('examinationForm')">提交</el-button>
        <el-button @click="resetForm('examinationForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      examinationForm: {
        name: '',
        subject: '',
        time: ''
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单逻辑，例如通过API发送数据
          console.log('提交的考试信息:', this.examinationForm);
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
    }
  }
};
</script>

<style scoped>
.new-examination-page {
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