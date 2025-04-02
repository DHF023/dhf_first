<template>
  <div class="add-batch-problems">
    <h2>批量添加题目</h2>
    <el-form :model="form" ref="form" label-width="120px">
      <el-form-item label="上传文件">
        <el-upload
          action=""
          :before-upload="handleBeforeUpload"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :file-list="fileList"
          accept=".csv, .xls, .xlsx"
        >
          <el-button type="primary">点击上传</el-button>
          <span slot="tip" class="el-upload__tip">支持扩展名：.csv, .xls, .xlsx</span>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="submitBatchProblems">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        file: null,
      },
      fileList: [],
    };
  },
  methods: {
    handleBeforeUpload(file) {
      // 在这里可以进行文件上传前的检查，比如文件大小、类型等
      this.form.file = file;
      return false; // 阻止自动上传，我们将在提交时手动上传
    },
    handleUploadSuccess(response, file, fileList) {
      // 处理文件上传成功的逻辑
      console.log('文件上传成功', response);
    },
    handleUploadError(err, file, fileList) {
      // 处理文件上传失败的逻辑
      console.error('文件上传失败', err);
    },
    submitBatchProblems() {
      if (!this.form.file) {
        this.$message.error('请先上传文件');
        return;
      }

      // 创建FormData对象，用于发送文件
      const formData = new FormData();
      formData.append('file', this.form.file);

      // 通过API发送文件和其他数据
      // 这里应该调用实际的API接口来上传文件
      // 例如：axios.post('/api/upload-problems', formData)
      // 但由于我们不知道具体的API接口，这里只是打印出formData
      console.log('准备上传的文件数据:', formData);

      // 假设上传成功后的处理逻辑
      // this.$message.success('题目批量添加成功');
      // 然后可能需要跳转页面或刷新列表等
    },
  },
};
</script>

<style scoped>
.add-batch-problems {
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

.el-upload__tip {
  color: #999;
  font-size: 12px;
  margin-top: 5px;
}
</style>