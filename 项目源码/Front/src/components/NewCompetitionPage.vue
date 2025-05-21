<template>
  <!-- 新建比赛页面模板 -->
  <div class="new-competition-page">
    <div class="left-part">
      <h2>创建新比赛</h2>
      <div style="border: 1px solid #dcdcdc; padding: 20px; height: 550px;">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="比赛基本信息" name="basicInfo">
            <el-form :model="competitionForm" :rules="rules" ref="competitionForm" label-width="100px">
              <el-form-item label="比赛名称" prop="name">
                <el-input v-model="competitionForm.name" class="custom-input-width" clearable placeholder="请输入比赛名称"></el-input>
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
              <el-form-item label="主办方名称" prop="organizer">
                <el-input v-model="competitionForm.organizer" class="custom-input-width" clearable placeholder="请输入主办方名称"></el-input>
              </el-form-item>
              <el-form-item label="比赛信息">
                <el-button type="primary" @click="showInfoDialog = true">编 辑</el-button>
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
                      {{ scope.row.title }}
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
          <el-button type="primary" @click="showConfirmDialog = true">创建比赛</el-button>
          <el-button @click="resetForm('competitionForm')"><span style="color: #333 !important;">重置</span></el-button>
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
          @select-problems-success="handleSelectProblemsSuccess"
          @add-problem-success="handleAddProblemSuccess"
        ></component>
      </div>
    </div>
    <el-dialog
        title="编辑比赛信息"
        :visible.sync="showInfoDialog"
        width="50%">
      <el-input
          type="textarea"
          v-model="editInfo"
          placeholder="请输入比赛详细信息"
          rows="4"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearInfo">清空</el-button>
        <el-button @click="showInfoDialog = false">取消</el-button>
        <el-button type="primary" @click="saveInfo">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="确认创建比赛"
        :visible.sync="showConfirmDialog"
        width="30%">
      <span>您确定要创建这场比赛吗？</span><br>
      <span>请确认输入内容的正确哦！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showConfirmDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateCompetition">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ManualAddProblem from '@/components/ManualAddProblem.vue';
import AutoAddProblem from '@/components/AutoAddProblem.vue';
import newRequest from '@/utils/newRequest';
import { formatDateToRFC1123 } from '@/utils/dateUtils';

// 新建比赛页面脚本
export default {
  data() {
    return {
      competitionForm: {
        name: '',
        startTime: '',
        endTime: '',
        organizer: '',
        info: '',
        problemIds: [],
      },
      rules: {
        name: [{ required: true, message: '比赛名称不能为空', trigger: 'blur' }],
        startTime: [{ required: true, message: '开始时间不能为空', trigger: 'change' }],
        endTime: [
          { required: true, message: '结束时间不能为空', trigger: 'change' },
          { validator: this.validateEndTime, trigger: 'change' }
        ],
        organizer: [{ required: true, message: '主办方名称不能为空', trigger: 'blur' }],
      },
      questionMode: '',
      currentAddProblem: null,
      questionList: [{ title: '题目1' }, { title: '题目2' }],
      showInfoDialog: false,
      editInfo: '',
      showConfirmDialog: false,
      activeTab: 'basicInfo',
    };
  },
  mounted() {
    this.syncProblemIds();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.syncProblemIds();
          const contestData = {
            title: this.competitionForm.name,
            start_time: formatDateToRFC1123(this.competitionForm.startTime),
            end_time: formatDateToRFC1123(this.competitionForm.endTime),
            information: this.competitionForm.info,
            problem_ids: this.competitionForm.problemIds,
          };
          newRequest.post('/api/contests', contestData)
              .then(response => {
                if (response.success) {
                  this.$message.success('比赛创建成功');
                } else {
                  this.$message.error(response.error || '比赛创建失败');
                }
              })
              .catch(error => {
                console.error('创建比赛时发生错误:', error);
                this.$message.error('比赛创建失败，请稍后重试');
              });
        } else {
          this.$message.error('表单验证失败，请检查输入内容');
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.competitionForm.info = '';
      this.competitionForm.problemIds = [];
      this.questionList = [];
      this.editInfo = '';
      this.questionMode = '';
      this.currentAddProblem = null;
      this.showInfoDialog = false;
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
    handleQuestionModeChange(value) {
      if (value === 'manual') {
        this.currentAddProblem = ManualAddProblem;
      } else if (value === 'auto') {
        this.currentAddProblem = AutoAddProblem;
      } else {
        this.currentAddProblem = null;
      }
    },
    clearInfo() {
      this.editInfo = '';
    },
    saveInfo() {
      this.competitionForm.info = this.editInfo;
      this.showInfoDialog = false;
    },
    handleSelectProblemsSuccess(selectedProblemIds) {
      const questionDetails = selectedProblemIds.map((id, index) => ({
        id,
        title: `题目${id}`,
      }));
      this.questionList = questionDetails;
    },
    handleAddProblemSuccess(title) {
      const newQuestion = { title, id: this.questionList.length + 1 };
      this.questionList.push(newQuestion);
      this.competitionForm.problemIds.push(newQuestion.id);
    },
    removeQuestion(index) {
      const removedQuestionId = this.questionList[index].id;
      this.questionList.splice(index, 1);
      this.competitionForm.problemIds = this.competitionForm.problemIds.filter(id => id !== removedQuestionId);
    },
    confirmCreateCompetition() {
      this.showConfirmDialog = false;
      this.submitForm('competitionForm');
    },
    syncProblemIds() {
      this.competitionForm.problemIds = this.questionList.map((_, index) => index + 1);
    },
  },
};
</script>

<style scoped>
/* 新建比赛页面样式 */
.new-competition-page {
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