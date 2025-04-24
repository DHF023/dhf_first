<template>
  <!-- 新建考试页面模板 -->
  <div class="new-examination-page">
    <div class="left-part">
      <h2>新建考试</h2>
      <div style="border: 1px solid #dcdcdc; padding: 20px; height: 550px;">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="考试基本信息" name="basicInfo">
            <el-form :model="examinationForm" :rules="rules" ref="examinationForm" label-width="80px">
              <el-form-item label="考试标题" prop="title">
                <el-input v-model="examinationForm.title" class="custom-input-width" clearable placeholder="请输入考试标题"></el-input>
              </el-form-item>
              <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                    v-model="examinationForm.startTime"
                    type="datetime"
                    placeholder="选择开始时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                    v-model="examinationForm.endTime"
                    type="datetime"
                    placeholder="选择结束时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="考试描述" prop="description">
                <el-input type="textarea" v-model="examinationForm.description" placeholder="请输入考试描述"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="题目列表" name="questionList">
            <div class="question-list">
              <div style="width: 100%">
                <el-table :data="questionList" border height="400">
                  <el-table-column prop="index" label="#" width="80">
                    <template v-slot="scope">
                      {{ scope.$index + 1 }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="title" label="标题">
                    <template v-slot="scope">
                      {{ scope.row.content }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="100">
                    <template v-slot="scope">
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeQuestion(scope.$index)"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="form-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitExamination">提交考试</el-button>
        </div>
      </div>
    </div>
    <div class="right-part">
      <h2>添加题目</h2>
      <el-select v-model="questionMode" placeholder="请选择添加题目方式" @change="handleQuestionModeChange">
        <el-option label="手动添加题目" value="manual"></el-option>
        <el-option label="智能推荐题目" value="auto"></el-option>
      </el-select>
      <div class="question-content">
        <component
            :is="currentAddProblem"
            @add-problem-success="handleAddProblemSuccess"
        ></component>
      </div>
    </div>
    <el-dialog
        title="确认创建考试"
        :visible.sync="showConfirmDialog"
        width="30%">
      <span>您确定要创建这场考试吗？</span><br>
      <span>请确认输入内容的正确哦！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showConfirmDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateExamination">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ManualAddProblem from '@/components/ManualAddProblem.vue';
import AutoAddProblem from '@/components/AutoAddProblem.vue';

// 新建考试页面脚本
export default {
  data() {
    return {
      examinationForm: {
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        questions: []
      },
      rules: {
        title: [{ required: true, message: '考试标题不能为空', trigger: 'blur' }],
        description: [{ trigger: 'blur' }],
        startTime: [{ required: true, message: '开始时间不能为空', trigger: 'change' }],
        endTime: [{ required: true, message: '结束时间不能为空', trigger: 'change' }]
      },
      questionMode: '',
      currentAddProblem: null,
      questionList: [],
      showConfirmDialog: false,
      activeTab: 'basicInfo',
    };
  },
  methods: {
    cancel() {
      // 取消操作，返回考试列表页面
      this.$router.push({ name: 'Examination' });
    },
    submitExamination() {
      // 提交考试表单验证
      this.$refs.examinationForm.validate(valid => {
        if (valid) {
          // 表单验证通过，显示确认对话框
          this.showConfirmDialog = true;
        } else {
          // 表单验证失败，输出错误信息
          console.log('表单验证失败');
        }
      });
    },
    handleQuestionModeChange(value) {
      // 处理题目添加方式变更
      if (value === 'manual') {
        this.currentAddProblem = ManualAddProblem;
      } else if (value === 'auto') {
        this.currentAddProblem = AutoAddProblem;
      } else {
        this.currentAddProblem = null;
      }
    },
    handleAddProblemSuccess(content) {
      // 添加新题目到题目列表和表单
      this.examinationForm.questions.push({ content: content });
      this.questionList = [...this.examinationForm.questions];
    },
    removeQuestion(index) {
      // 从题目列表和表单中移除题目
      this.examinationForm.questions.splice(index, 1);
      this.questionList = [...this.examinationForm.questions];
    },
    confirmCreateExamination() {
      // 确认创建考试，关闭对话框
      this.showConfirmDialog = false;
      // 输出考试创建成功信息
      console.log('考试创建成功');
    }
  }
};
</script>

<style scoped>
/* 新建考试页面样式 */
.new-examination-page {
  display: flex;
  padding: 10px 20px 10px 20px;
  background-color: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  min-height: calc(100vh - 60px);
  overflow: auto;
}

.left-part, .right-part {
  flex: 1;
  padding-right: 10px;
  position: relative;
}

.right-part {
  border-left: 1px solid #000;
  padding-left: 10px;
  padding-right: 0;
}

h2, h3 {
  margin-bottom: 20px;
  font-size: 24px;
}

.form-footer {
  position: absolute;
  bottom: 20px;
  right: 20px;
  text-align: right;
}

.question-content {
  margin-top: 20px;
}

.question-list {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
}

.custom-input-width {
  width: 300px;
}

/deep/ .el-textarea__inner {
  resize: none;
}
</style>