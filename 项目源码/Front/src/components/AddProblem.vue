<template>
  <div class="container">
    <div class="add-problem">
      <h2>添加题目</h2>

      <!-- 标签页组件，用于切换手动添加和批量添加 -->
      <el-tabs v-model="activeTab">
        <el-tab-pane label="手动添加" name="manual">
          <el-form :model="problemForm" ref="problemForm" label-width="120px">
            <!-- 题目标题输入框 -->
            <el-form-item label="题目标题" prop="title" :rules="{ required: true, message: '题目标题不能为空' }">
              <el-input v-model="problemForm.title" placeholder="请输入题目名称"></el-input>
            </el-form-item>

            <!-- 时间限制输入框 -->
            <el-form-item label="时间限制(ms)" prop="time_limit" :rules="{ required: true, type: 'number', message: '时间限制必须为数字' }">
              <el-input v-model.number="problemForm.time_limit"></el-input>
            </el-form-item>

            <!-- 内存限制输入框 -->
            <el-form-item label="内存限制(MB)" prop="memory_limit" :rules="{ required: true, type: 'number', message: '内存限制必须为数字' }">
              <el-input v-model.number="problemForm.memory_limit"></el-input>
            </el-form-item>

            <!-- 难度输入框 -->
            <el-form-item label="难度" prop="difficulty" :rules="{ required: true, type: 'number', message: '难度必须为数字' }">
              <el-input v-model.number="problemForm.difficulty"></el-input>
            </el-form-item>

            <!-- 是否公开开关 -->
            <el-form-item label="是否公开">
              <el-switch v-model="problemForm.is_public"></el-switch>
            </el-form-item>

            <!-- 题目描述输入框 -->
            <el-form-item label="题目描述" prop="statement" :rules="{ required: true, message: '题目描述不能为空' }">
              <el-input type="textarea" v-model="problemForm.statement" placeholder="请输入题目描述"></el-input>
            </el-form-item>

            <!-- 标签输入和显示区域 -->
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
                v-if="inputVisible"
                v-model="inputValue"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              ></el-input>
              <el-button v-else size="small" @click="showInput">+ 新标签</el-button>
            </el-form-item>
          </el-form>

          <!-- 表单操作按钮 -->
          <div class="form-buttons">
            <el-button type="primary" @click="showConfirmDialog">提交</el-button>
            <el-button @click="resetForm('problemForm')">重置</el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="批量添加" name="batch">
          <div class="batch-upload-container">
            <div class="upload-actions">
              <el-button
                type="text"
                @click="downloadTemplate('txt')"
                icon="el-icon-download"
              >
                下载TXT模板
              </el-button>
              <el-button
                type="text"
                @click="downloadTemplate('excel')"
                icon="el-icon-download"
              >
                下载Excel模板
              </el-button>
            </div>

            <el-upload
              action="/api/problems/batch-upload"
              multiple
              :limit="10"
              :before-upload="beforeUpload"
              :on-success="handleBatchUploadSuccess"
              :on-exceed="handleUploadExceed"
              accept=".txt,.md,.xlsx"
            >
              <el-button type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                支持.txt/.md/.xlsx格式文件，文件大小不超过10MB
              </div>
            </el-upload>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 确认对话框 -->
    <el-dialog
      title="确认添加题目"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleDialogClose"
    >
      <span>您确定要添加这道题目吗？</span>
      <span>认真检查填写的题目信息哦！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSubmit">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import newRequest from '@/utils/newRequest';

export default {
  data() {
    return {
      activeTab: 'manual', // 当前激活的标签页
      problemForm: {
        title: '',
        time_limit: 0,
        memory_limit: 0,
        difficulty: 0,
        is_public: false,
        statement: '',
        tags: []
      },
      inputVisible: false, // 控制新标签输入框的显示
      inputValue: '', // 新标签输入框的值
      addedProblems: [], // 已添加的题目列表
      user: JSON.parse(localStorage.getItem('user')) || {}, // 当前用户信息
      dialogVisible: false, // 确认对话框的显示状态
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          newRequest.post('/api/problem/create', this.problemForm)
            .then(response => {
              if (response.OK && response.problem_id) {
                this.$message.success(`题目创建成功，您创建的题目ID为${response.problem_id}`);
                this.addedProblems.push({ ...this.problemForm, id: response.problem_id });
                this.resetForm(formName);
              } else {
                this.$message.error(response.message || '题目创建失败');
              }
            })
            .catch(error => {
              if (error.response) {
                this.$message.error(error.response.error || '题目创建失败');
              } else if (error.request) {
                this.$message.error('请求失败，请检查网络');
              } else {
                this.$message.error(`请求出错: ${error.message}`);
              }
            });
        } else {
          this.$message.error('请填写完整的题目信息');
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.problemForm.tags = [];
    },
    handleInputConfirm() {
      if (this.inputValue) {
        this.problemForm.tags.push(this.inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    removeTag(tag) {
      this.problemForm.tags.splice(this.problemForm.tags.indexOf(tag), 1);
    },
    // 验证上传文件格式
    beforeUpload(file) {
      const isText = file.type === 'text/plain' ||
                    file.name.endsWith('.txt') ||
                    file.name.endsWith('.md');
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                     file.name.endsWith('.xlsx');

      if (!isText && !isExcel) {
        this.$message.error('只能上传TXT、MD或Excel文件');
        return false;
      }

      // 文件大小限制10MB
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过10MB');
        return false;
      }

      return true;
    },

    // 解析上传的文件内容
    parseFileContent(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target.result;
            const problems = [];

            // 简单解析逻辑，实际应根据文件格式实现
            if (file.name.endsWith('.xlsx')) {
              // Excel解析逻辑
              // 这里需要实际实现Excel解析
              resolve({ type: 'excel', problems });
            } else {
              // 文本文件解析
              const lines = content.split('\n');
              let currentProblem = null;

              lines.forEach(line => {
                line = line.trim();
                if (!line) return;

                // 识别题目类型
                if (line.startsWith('【选择题】')) {
                  currentProblem = {
                    type: 'choice',
                    question: line.replace('【选择题】', '').trim(),
                    options: [],
                    answer: '',
                    time_limit: 1000,
                    memory_limit: 256,
                    difficulty: 3
                  };
                  problems.push(currentProblem);
                }
                else if (line.startsWith('【判断题】')) {
                  currentProblem = {
                    type: 'judge',
                    question: line.replace('【判断题】', '').trim(),
                    answer: false,
                    time_limit: 500,
                    memory_limit: 128,
                    difficulty: 2
                  };
                  problems.push(currentProblem);
                }
                else if (line.startsWith('【填空题】')) {
                  currentProblem = {
                    type: 'fill',
                    question: line.replace('【填空题】', '').trim(),
                    answer: '',
                    time_limit: 800,
                    memory_limit: 192,
                    difficulty: 3
                  };
                  problems.push(currentProblem);
                }
                else if (currentProblem) {
                  // 处理题目内容
                  if (line.startsWith('A.')) currentProblem.options[0] = line.substring(2).trim();
                  else if (line.startsWith('B.')) currentProblem.options[1] = line.substring(2).trim();
                  else if (line.startsWith('C.')) currentProblem.options[2] = line.substring(2).trim();
                  else if (line.startsWith('D.')) currentProblem.options[3] = line.substring(2).trim();
                  else if (line.startsWith('答案:')) {
                    const answer = line.substring(3).trim();
                    if (currentProblem.type === 'judge') {
                      currentProblem.answer = answer.toLowerCase() === '正确' || answer.toLowerCase() === 'true';
                    } else {
                      currentProblem.answer = answer;
                    }
                  }
                  // 处理填空题答案
                  else if (line.startsWith('填空答案:')) {
                    currentProblem.answer = line.substring(5).trim();
                  }
                }
              });

              resolve({ type: 'text', problems });
            }
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    },

    async handleBatchUploadSuccess(response, file, fileList) {
      const loading = this.$loading({
        lock: true,
        text: '正在解析题目文件...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      try {
        const { problems } = await this.parseFileContent(file);

        if (problems.length === 0) {
          loading.close();
          this.$message.warning('文件中未找到有效题目');
          return;
        }

        loading.text = `已解析 ${problems.length} 道题目，正在提交...`;

        // 实际提交到API
        const res = await newRequest.post('/api/problems/batch-create', {
          problems,
          creator_id: this.user.id
        });

        loading.close();

        if (res.status === 200) {
          this.$notify({
            title: '成功',
            message: `成功添加 ${res.data.count} 道题目`,
            type: 'success',
            duration: 3000
          });

          // 显示添加的题目统计
          const typeCount = problems.reduce((acc, p) => {
            acc[p.type] = (acc[p.type] || 0) + 1;
            return acc;
          }, {});

          let statsMessage = '';
          if (typeCount.choice) statsMessage += `选择题: ${typeCount.choice}道 `;
          if (typeCount.judge) statsMessage += `判断题: ${typeCount.judge}道 `;
          if (typeCount.fill) statsMessage += `填空题: ${typeCount.fill}道`;

          this.$message.success(statsMessage);
          this.addedProblems.push(...res.data.problems);
        } else {
          this.$message.error(res.message || '题目添加失败');
        }
      } catch (error) {
        loading.close();
        this.$message.error(`题目解析失败: ${error.message}`);
      }
    },
    handleUploadExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    showConfirmDialog() {
      this.$refs.problemForm.validate(valid => {
        if (valid) {
          this.dialogVisible = true;
        } else {
          this.$message.error('请填写完整的题目信息');
        }
      });
    },
    confirmSubmit() {
      this.dialogVisible = false;
      this.submitForm('problemForm');
    },
    handleDialogClose(done) {
      this.dialogVisible = false;
      done();
    },

    // 下载模板文件
    downloadTemplate(type) {
      let content = '';
      let filename = '';

      if (type === 'txt') {
        filename = '题目模板.txt';
        content = `# 选择题示例
【选择题】
1+1等于多少？
A. 1
B. 2
C. 3
D. 4
答案: B

# 判断题示例
【判断题】
Python是一种解释型语言
答案: 正确

# 填空题示例
【填空题】
中国的首都是____
填空答案: 北京

# 注意事项：
1. 每题必须以【题型】开头
2. 选择题选项必须从A.开始按顺序排列
3. 答案行必须包含"答案:"或"填空答案:"前缀`;
      } else if (type === 'excel') {
        filename = '题目模板.xlsx';
        // 这里实际应该生成Excel文件，简化示例使用文本
        content = `题型,题目内容,选项A,选项B,选项C,选项D,答案,时间限制(ms),内存限制(MB),难度,标签
选择题,1+1等于多少？,1,2,3,4,B,1000,256,3,数学基础
判断题,Python是一种解释型语言,,,,,正确,500,128,2,编程基础
填空题,中国的首都是____,,,,,北京,800,192,3,常识`;
      }

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      this.$message.success(`模板文件 ${filename} 下载成功`);
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  min-height: calc(100vh - 60px);
}

.add-problem {
  width: 60%;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-height: 600px;
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

.dialog-footer {
  text-align: right;
  padding-top: 20px;
}

.batch-upload-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.upload-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

/deep/ .el-textarea__inner {
  resize: none;
}
</style>

<style scoped>
.container {
  padding: 20px;
  min-height: calc(100vh - 60px);
}

.add-problem {
  width: 60%;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-height: 600px;
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

.dialog-footer {
  text-align: right;
  padding-top: 20px;
}

/deep/ .el-textarea__inner {
  resize: none;
}
</style>