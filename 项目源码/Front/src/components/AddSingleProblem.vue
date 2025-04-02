<template>
  <div class="add-single-problem">
    <h2>添加单个题目</h2>
    <el-form :model="problemForm" :rules="rules" ref="problemForm" label-width="120px">
      <el-form-item label="题目名称" prop="title">
        <el-input v-model="problemForm.title" placeholder="请输入题目名称"></el-input>
      </el-form-item>
      <el-form-item label="题目描述" prop="description">
        <el-input type="textarea" v-model="problemForm.description" placeholder="请输入题目描述"></el-input>
      </el-form-item>
      <el-form-item label="难度等级" prop="difficulty">
        <el-select v-model="problemForm.difficulty" placeholder="请选择难度等级">
          <el-option label="简单" value="easy"></el-option>
          <el-option label="中等" value="medium"></el-option>
          <el-option label="困难" value="hard"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-tag
          :key="tag"
          v-for="tag in problemForm.tags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitProblem">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      problemForm: {
        title: '',
        description: '',
        difficulty: '',
        tags: []
      },
      inputVisible: false,
      inputValue: '',
      rules: {
        title: [
          { required: true, message: '请输入题目名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入题目描述', trigger: 'blur' }
        ],
        difficulty: [
          { required: true, message: '请选择难度等级', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    handleClose(tag) {
      this.problemForm.tags.splice(this.problemForm.tags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.problemForm.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    submitProblem() {
      this.$refs.problemForm.validate((valid) => {
        if (valid) {
          // 提交题目信息到服务器
          // 例如：axios.post('/api/problems', this.problemForm)
          // 这里只是打印出表单数据
          console.log('提交的题目信息:', this.problemForm);
          // 提交成功后可以重置表单或跳转页面等
          // this.$message.success('题目添加成功');
          // this.resetForm();
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.problemForm.resetFields();
      this.problemForm.tags = [];
    }
  }
};
</script>

<style scoped>
.add-single-problem {
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

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>