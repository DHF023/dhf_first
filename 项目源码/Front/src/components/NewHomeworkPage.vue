<template>
  <!-- 新建作业页面模板 -->
  <div class="new-homework-page">
    <div class="left-part">
      <h2>新建作业</h2>
      <div style="border: 1px solid #dcdcdc; padding: 20px; height: 550px;">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="作业基本信息" name="basicInfo">
            <el-form :model="homeworkForm" :rules="rules" ref="homeworkForm" label-width="80px">
              <el-form-item label="作业标题" prop="title">
                <el-input v-model="homeworkForm.title" class="custom-input-width" clearable placeholder="请输入作业标题"></el-input>
              </el-form-item>
              <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                  v-model="homeworkForm.startTime"
                  type="datetime"
                  placeholder="选择开始时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                  v-model="homeworkForm.endTime"
                  type="datetime"
                  placeholder="选择结束时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="作业描述" prop="description">
                <el-input type="textarea" v-model="homeworkForm.description" placeholder="请输入作业描述"></el-input>
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
          <el-button type="primary" @click="submitHomework">提交作业</el-button>
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
        title="确认创建作业"
        :visible.sync="showConfirmDialog"
        width="30%">
      <span>您确定要创建这份作业吗？</span><br>
      <span>请确认输入内容的正确哦！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showConfirmDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateHomework">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ManualAddProblem from '@/components/ManualAddProblem.vue';
import AutoAddProblem from '@/components/AutoAddProblem.vue';

// 新建作业页面脚本
export default {
  data() {
    return {
      homeworkForm: {
        title: '', // 作业标题
        description: '', // 作业描述
        startTime: '', // 作业开始时间
        endTime: '', // 作业结束时间
        questions: [] // 作业题目列表
      },
      rules: {
        // 表单验证规则
        title: [{ required: true, message: '作业标题不能为空', trigger: 'blur' }],
        description: [{ trigger: 'blur' }],
        startTime: [{ required: true, message: '开始时间不能为空', trigger: 'change' }],
        endTime: [{ required: true, message: '结束时间不能为空', trigger: 'change' }]
      },
      questionMode: '', // 题目添加模式
      currentAddProblem: null, // 当前添加题目组件
      questionList: [], // 题目列表显示数据
      showConfirmDialog: false, // 是否显示确认对话框
      activeTab: 'basicInfo', // 当前激活的标签页
    };
  },
  methods: {
    cancel() {
      // 取消操作，返回作业列表页面
      this.$router.push({ name: 'Homework' });
    },
    submitHomework() {
      // 提交作业表单验证
      this.$refs.homeworkForm.validate(valid => {
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
      this.homeworkForm.questions.push({ content: content });
      this.questionList = [...this.homeworkForm.questions];
    },
    removeQuestion(index) {
      // 从题目列表和表单中移除题目
      this.homeworkForm.questions.splice(index, 1);
      this.questionList = [...this.homeworkForm.questions];
    },
    confirmCreateHomework() {
      // 确认创建作业，关闭对话框
      this.showConfirmDialog = false;
      // 输出作业创建成功信息
      console.log('作业创建成功');
    }
  }
};
</script>

<style scoped>
/* 新建作业页面样式 */
.new-homework-page {
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