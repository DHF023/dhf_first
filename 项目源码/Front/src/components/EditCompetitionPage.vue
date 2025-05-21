<template>
  <div class="edit-competition-page">
    <div class="left-part">
      <h2>编辑比赛</h2>
      <div style="border: 1px solid #dcdcdc; padding: 20px; height: 550px;">
        <el-tabs v-model="activeTab" style="height: 450px;">
          <el-tab-pane label="比赛基本信息" name="basicInfo">
            <el-form :model="competitionForm" :rules="rules" ref="competitionForm" label-width="80px">
              <el-form-item label="比赛名称" prop="name">
                <el-input v-model="competitionForm.name" class="custom-input-width" clearable placeholder="请输入比赛名称"></el-input>
              </el-form-item>
              <el-form-item label="比赛信息">
                <el-button type="primary" @click="showInfoDialog = true">编 辑</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="题目列表" name="questionList">
            <div class="question-list">
              <el-table :data="competitionForm.questionList" border height="400">
                <el-table-column prop="index" label="#" width="80">
                  <template v-slot="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="title" label="标题">
                  <template v-slot="scope">
                    {{ '题目' + scope.row.id }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template v-slot="scope">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeQuestion(scope.$index)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="比赛用户列表" name="userList">
            <CompetitionUsers :contest-id="contestId" @update-user-list="handleUpdateUserList" />
          </el-tab-pane>
        </el-tabs>
        <div class="form-footer">
          <el-button type="primary" @click="updateCompetition">保存修改</el-button>
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
        v-model="competitionForm.info"
        placeholder="请输入比赛详细信息"
        rows="4"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showInfoDialog = false">取消</el-button>
        <el-button type="primary" @click="saveInfoDialog">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import newRequest from '@/utils/newRequest';
import CompetitionUsers from '@/components/CompetitionUsers.vue';
import ManualAddProblem from "@/components/ManualAddProblem";
import AutoAddProblem from "@/components/AutoAddProblem";

export default {
  data() {
    return {
      competitionForm: {
        name: null,
        info: '',
        questionList: [],
        userList: [],
      },
      originalContestDetails: null,
      rules: {
        name: [{ required: true, message: '比赛名称不能为空', trigger: 'blur' }],
      },
      showInfoDialog: false,
      contestId: this.$route.params.contestId,
      activeTab: 'basicInfo',
      questionMode: '',
      currentAddProblem: null,
    };
  },
  components: {
    CompetitionUsers
  },
  mounted() {
    this.fetchContestDetails(); // 组件挂载时获取比赛详情
  },
  methods: {
    async fetchContestDetails() {
      try {
        const response = await newRequest.get(`/api/contest/getinfo/${this.contestId}`);
        if (response) {
          this.originalContestDetails = {
            name: response.contest_title,
            info: response.information,
            questionList: response.problem_ids.map(problemId => ({
              id: problemId,
              title: `题目${problemId}`
            })),
            userList: this.competitionForm.userList || []
          };
          this.competitionForm.name = this.originalContestDetails.name;
          this.competitionForm.info = this.originalContestDetails.info;
          this.competitionForm.questionList = this.originalContestDetails.questionList;
          this.competitionForm.userList = this.originalContestDetails.userList;
        } else {
          this.$message.error('获取比赛详情失败，响应数据为空');
        }
      } catch (error) {
        console.error('获取比赛详情时发生错误:', error);
        this.$message.error('获取比赛详情失败，请稍后重试');
      }
    },
    updateCompetition() {
      this.$refs.competitionForm.validate((valid) => {
        if (valid) {
          const basicInfo = {
            title: this.competitionForm.name,
            information: this.competitionForm.info,
          };
          const problemIds = this.competitionForm.questionList.map(question => question.id);
          const userIds = this.competitionForm.userList.map(user => user.user_id);

          newRequest.post(`/api/contest/update_contest_info/${this.contestId}`, basicInfo)
              .then(response => {
                if (response.OK === "update success") {
                  this.$message.success('比赛信息更新成功');
                } else if (response.error) {
                  this.$message.error(response.error);
                } else {
                  this.$message.error('比赛信息更新失败，未知错误');
                }
              })
              .catch(error => {
                console.error('更新比赛信息时发生网络错误:', error);
                this.$message.error('比赛信息更新失败，请检查网络连接或稍后重试');
              });

          newRequest.post(`/api/contest/update_problems/${this.contestId}`, { problem_ids: problemIds })
              .then(response => {
                if (response.success) {
                  this.$message.success('比赛题目列表更新成功');
                } else if (response.error) {
                  this.$message.error(response.error);
                } else {
                  this.$message.error('比赛题目列表更新失败，未知错误');
                }
              })
              .catch(error => {
                console.error('更新比赛题目列表时发生网络错误:', error);
                this.$message.error('比赛题目列表更新失败，请检查网络连接或稍后重试');
              });

          newRequest.post(`/api/contest/update_contest_user/${this.contestId}`, { users: userIds })
              .then(response => {
                if (response.success) {
                  this.$message.success('比赛用户列表更新成功');
                  console.log('Added users:', response.added);
                  console.log('Removed users:', response.removed);
                  console.log('Total users:', response.total);
                } else if (response.error) {
                  this.$message.error(response.error);
                } else {
                  this.$message.error('比赛用户列表更新失败，未知错误');
                }
              })
              .catch(error => {
                console.error('更新比赛用户列表时发生网络错误:', error);
                this.$message.error('比赛用户列表更新失败，请检查网络连接或稍后重试');
              });

        } else {
          this.$message.error('表单验证失败，请检查输入内容');
        }
      });
    },
    resetForm(formName) {
      if (this.originalContestDetails) {
        this.competitionForm.name = this.originalContestDetails.name;
        this.competitionForm.info = this.originalContestDetails.info;
        this.competitionForm.questionList = this.originalContestDetails.questionList;
        this.competitionForm.userList = [...this.originalContestDetails.userList];
        this.$message.success('表单已重置为初始状态');
        window.location.reload();
      } else {
        this.$message.error('无法重置表单，初始比赛详情未获取');
      }
    },
    saveInfoDialog() {
      this.showInfoDialog = false;
    },
    removeQuestion(index) {
      this.competitionForm.questionList.splice(index, 1);
      this.$message.success('题目已移除');
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
    handleSelectProblemsSuccess(selectedProblemIds) {
      const questionDetails = selectedProblemIds.map((id, index) => ({
        id,
        title: `题目${id}`,
      }));
      this.competitionForm.questionList = questionDetails;
    },
    handleAddProblemSuccess(title) {
      const newQuestion = {
        title: title,
        id: this.competitionForm.questionList.length + 1
      };
      this.competitionForm.questionList.push(newQuestion);
    },
    handleUpdateUserList(userList) {
      console.log('传入的用户列表:', userList);
      this.competitionForm.userList = userList;
    }
  },
};
</script>

<style scoped>
.edit-competition-page {
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

h2 {
  margin-bottom: 20px;
  font-size: 24px;
}

.form-footer {
  margin-top: 20px;
  text-align: right;
}

.custom-input-width {
  width: 300px;
}

/deep/ .el-textarea__inner {
  resize: none;
}

.question-content {
  margin-top: 20px;
}
</style>