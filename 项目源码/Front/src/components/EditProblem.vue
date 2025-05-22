<template>
  <div class="container">
    <div class="edit-problem">
      <h2>编辑题目</h2>
      <el-form :model="problemForm" ref="problemForm" label-width="120px">
        <el-form-item label="题目标题" prop="title" :rules="[validationRules().title]">
          <el-input v-model="problemForm.title" placeholder="请输入题目名称" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="时间限制(ms)" prop="time_limit" :rules="[validationRules().time_limit]">
          <el-input v-model.number="problemForm.time_limit" type="number" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="内存限制(MB)" prop="memory_limit" :rules="[validationRules().memory_limit]">
          <el-input v-model.number="problemForm.memory_limit" type="number" style="width: 100px;"></el-input>
        </el-form-item>
        <el-form-item label="题目描述" prop="statement" :rules="[validationRules().statement]">
          <el-input type="textarea" v-model="problemForm.statement" :rows="4" placeholder="请输入题目描述"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-tag
              v-for="tag in problemForm.tags"
              :key="tag"
              closable
              @close="removeTag(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="mini"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput"><span style="color: #333 !important;">+ 新标签</span></el-button>
        </el-form-item>
        <div class="form-buttons">
          <el-button type="primary" @click="showConfirmDialog">提交</el-button>
          <el-button @click="resetForm"><span style="color: #333 !important;">重置</span></el-button>
        </div>
      </el-form>
    </div>
    <confirm-dialog
        ref="confirmDialog"
        title="确认修改题目"
        message="您确定要修改这道题目吗？"
        :on-confirm="confirmSubmit"
    />
  </div>
</template>

<script>
import newRequest from '@/utils/newRequest';
import ConfirmDialog from './common/ConfirmDialog.vue';

export default {
  components: {
    ConfirmDialog
  },
  data() {
    return {
      problemForm: {
        title: '',
        time_limit: 0,
        memory_limit: 0,
        statement: '',
        tags: []
      },
      inputVisible: false,
      inputValue: '',
      problemId: this.$route.params.problemId, // 当前题目ID，从路由参数获取
      isSubmitting: false,
    };
  },
  created() {
    this.fetchProblemDetails(); // 组件创建时获取题目详情
  },
  methods: {
    validationRules() {
      // 返回表单验证规则
      return {
        title: { required: true, message: '题目标题不能为空' },
        time_limit: { required: true, type: 'number', message: '时间限制必须为数字' },
        memory_limit: { required: true, type: 'number', message: '内存限制必须为数字' },
        statement: { required: true, message: '题目描述不能为空' }
      };
    },

    fetchProblemDetails() {
      // 获取题目详情
      const requestBody = { problem_id: this.problemId };
      newRequest.post('/api/problem/statement/get', requestBody)
          .then(response => {
            this.problemForm = response;
          })
          .catch(this.handleError);
    },

    resetForm() {
      // 重置表单
      this.$refs.problemForm.resetFields();
      this.problemForm.tags = [];
      this.fetchProblemDetails();
    },

    handleInputConfirm() {
      // 确认输入新标签
      if (this.inputValue) {
        this.problemForm.tags.push(this.inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },

    showInput() {
      // 显示输入新标签的输入框
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    removeTag(tag) {
      // 移除标签
      this.problemForm.tags.splice(this.problemForm.tags.indexOf(tag), 1);
    },

    handleError(error) {
      // 处理请求错误
      let errorMessage = '请求失败，请稍后重试';
      if (error.response) {
        errorMessage = error.response.data.error || '服务器错误';
      } else if (error.request) {
        errorMessage = '请求未发送，请检查网络连接';
      } else {
        errorMessage = `请求出错: ${error.message}`;
      }
      this.$message.error(errorMessage);
    },

    showConfirmDialog() {
      // 显示确认对话框
      this.$refs.problemForm.validate(valid => {
        if (valid) {
          this.$refs.confirmDialog.show();
        } else {
          this.$message.error('请填写完整的题目信息');
        }
      });
    },

    confirmSubmit() {
      // 确认提交修改
      this.dialogVisible = false;
      this.isSubmitting = true; // 设置提交状态，防止重复提交

      const updateData = { ...this.problemForm };

      newRequest.post(`/api/problem/statement/update/${this.problemId}`, updateData)
          .then(response => {
            this.$message.success('题目更新成功');
            this.isSubmitting = false; // 清除提交状态
          })
          .catch(error => {
            this.handleError(error);
            this.isSubmitting = false; // 清除提交状态
          });
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  min-height: calc(100vh - 60px);
}

.edit-problem {
  width: 60%;
  min-height: 600px;
  margin: 0 auto;
  background-color: #fff;
  padding: 0 20px 20px 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.form-buttons {
  text-align: center;
  margin-top: 20px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

/deep/ .el-textarea__inner {
  resize: none;
}
</style>