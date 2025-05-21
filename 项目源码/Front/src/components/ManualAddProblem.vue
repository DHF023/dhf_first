<template>
  <!-- 手动添加题目组件的模板 -->
  <div class="manual-add-problem-tabs">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="新建题目" name="newProblem">
        <el-form :model="newProblemForm" :rules="newProblemRules" ref="newProblemForm" label-width="80px">
          <el-form-item label="标题" prop="title">
            <el-input v-model="newProblemForm.title" placeholder="请输入题目标题" style="width: 250px;" clearable></el-input>
          </el-form-item>
          <el-form-item label="题目描述" prop="description">
            <el-input type="textarea" v-model="newProblemForm.description" placeholder="请输入题目描述"></el-input>
          </el-form-item>
          <el-form-item label="难度" prop="difficulty">
            <el-select v-model="newProblemForm.difficulty" placeholder="请选择难度">
              <el-option label="简单" value="simple"></el-option>
              <el-option label="中等" value="medium"></el-option>
              <el-option label="困难" value="hard"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签" prop="knowledgePoints">
            <el-select v-model="newProblemForm.knowledgePoints" multiple placeholder="请选择知识点">
              <el-option label="算法" value="algorithm"></el-option>
              <el-option label="数据结构" value="dataStructure"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="加入题库">
            <el-switch v-model="addToLibrary" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitNewProblem('newProblemForm')">添加题目</el-button>
            <el-button @click="resetForm('newProblemForm')"><span style="color: #333 !important;">重置</span></el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="筛选添加" name="filterAdd">
        <FilterAddProblem @add-problems-success="handleAddProblemsSuccess" />
      </el-tab-pane>
      <el-tab-pane label="批量导入" name="batchImport">
        <div class="batch-import-content">
          <el-upload
            action="/api/problems/batch-import"
            :on-success="handleBatchImportSuccess"
            :on-error="handleBatchImportError"
            :before-upload="beforeBatchImportUpload"
            accept=".csv, .xlsx"
          >
            <el-button type="primary">导入文件</el-button>
          </el-upload>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FilterAddProblem from '@/components/FilterAddProblem.vue';
import newRequest from '@/utils/newRequest';

// 手动添加题目组件的脚本
export default {
  name: 'ManualAddProblemTabs',
  components: {
    FilterAddProblem,
  },
  data() {
    return {
      activeTab: 'newProblem', // 当前激活的标签页
      newProblemForm: {
        title: '', // 题目标题
        description: '', // 题目描述
        difficulty: '', // 题目难度
        knowledgePoints: [] // 知识点标签
      },
      addToLibrary: false, // 是否加入题库
      newProblemRules: {
        // 新建题目表单的验证规则
        title: [{ required: true, message: '题目标题不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '题目描述不能为空', trigger: 'blur' }],
        difficulty: [{ required: true, message: '请选择题目难度', trigger: 'change' }],
        knowledgePoints: [{ type: 'array', required: true, message: '请选择至少一个知识点', trigger: 'change' }]
      }
    };
  },
  methods: {
    // 提交新建题目表单
    submitNewProblem(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addToLibrary) {
            newRequest.post('/api/problems', this.newProblemForm)
                .then(response => {
                  if (response.success) {
                    this.$message.success('题目添加成功并加入题库');
                    this.$emit('add-problem-success', this.newProblemForm.title);
                    this.resetForm(formName);
                  } else {
                    this.$message.error('题目添加失败，请稍后重试');
                  }
                })
                .catch(error => {
                  console.error('添加题目到题库时发生错误:', error);
                  this.$message.error('题目添加失败，请稍后重试');
                });
          } else {
            this.$message.success('题目已添加（未加入题库）');
            this.$emit('add-problem-success', this.newProblemForm.title);
            this.resetForm(formName);
          }
        } else {
          this.$message.error('表单验证失败，请检查输入内容');
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.addToLibrary = false;
    },
    // 处理筛选添加题目成功的逻辑
    handleAddProblemsSuccess(addedProblems) {
      this.$message.success('题目添加成功');
      // 可添加其他处理逻辑
    },
    // 处理批量导入文件成功的逻辑
    handleBatchImportSuccess(response) {
      this.$message.success('文件导入成功');
      // 根据响应数据进行处理
    },
    // 处理批量导入文件失败的逻辑
    handleBatchImportError(error) {
      this.$message.error('文件导入失败，请检查文件内容');
      console.error('文件导入错误:', error);
    },
    // 文件上传前的检查逻辑
    beforeBatchImportUpload(file) {
      const isCSVOrExcel = file.type === 'application/vnd.ms-excel' || file.type === 'text/csv' || file.name.endsWith('.csv') || file.name.endsWith('.xlsx');
      if (!isCSVOrExcel) {
        this.$message.error('只能上传CSV或Excel文件');
        return false;
      }
      return true;
    }
  }
};
</script>

<style scoped>
/* 手动添加题目组件的样式 */
.manual-add-problem-tabs {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
}

.batch-import-content {
  /* 批量导入内容的样式 */
}
</style>