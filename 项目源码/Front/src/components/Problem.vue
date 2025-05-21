<template>
  <!-- 题目组件模板 -->
  <div class="problem">
    <div class="left-part" :class="{ collapsed: isSidebarCollapsed }">
      <div>
        <div v-if="isSidebarCollapsed">
          <div style="width: 100%; height: 30px;">
            <el-button class="toggle-button" @click="toggleSidebar" plain>
              <i class="el-icon-arrow-right" style="color: #4c4c4c;"></i>
            </el-button>
          </div>
          <el-divider class="divider-collapse"></el-divider>
        </div>
        <div v-else>
          <div class="toggle-button-container">
            <el-button class="toggle-button" @click="toggleSidebar" plain>
              <i class="el-icon-arrow-left" style="color: #4c4c4c;"></i>
            </el-button>
          </div>
          <el-divider class="divider"></el-divider>
          <el-button type="primary" size="medium" class="goto-button" @click="Submit" v-if="!isSubmit" round>提交答案</el-button>
          <el-button type="primary" size="medium" class="goto-button" @click="Submit" v-else round>返回题目</el-button>
          <el-button type="primary" size="medium" class="goto-button" @click="fetchUserProblemSubmissions" round>提交记录</el-button>
        </div>
      </div>
    </div>
    <div class="container" :class="{ expanded: !isSidebarCollapsed, collapsed: isSidebarCollapsed }">
      <div class="detail" v-if="!isSubmit">
        <el-container style="background-color: #ffffff;">
          <el-header style="height: 60px; display: flex;">
            <h2 style="width: 50%">{{ problem.id }} {{ problem.title }}</h2>
          </el-header>
          <el-row v-if="!hasError && problem.difficulty" style="margin: 10px 0; padding: 0 20px; display: flex; align-items: center;">
            <el-tag :type="difficultyTagType" effect="dark" style="border-radius: 20px; margin-right: 10px;">
              {{ problem.difficulty }}
            </el-tag>
            <el-tag
                v-for="tag in problem.tags"
                :key="tag"
                type="info"
                effect="dark"
                style="border-radius: 20px; margin-right: 5px;"
            >
              {{ tag }}
            </el-tag>
          </el-row>
          <el-main style="margin-bottom: 30px;">
            <h2>题目描述</h2>
            <div v-if="!hasError && problem.statement" v-html="problem.statement"></div>
            <el-empty v-else description="暂无题目描述"></el-empty>
          </el-main>
        </el-container>
      </div>
      <div class="editor" v-else>
        <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-left: 15px;">
          <el-tab-pane label="提交代码" name="first">
            <div>
              语言：
              <el-select
                  v-model="opts.language"
                  clearable
                  placeholder="请选择"
                  size="mini"
                  @change="changeLanguage"
              >
                <el-option
                    v-for="item in sets.language"
                    :key="item"
                    :label="item"
                    :value="item"
                ></el-option>
              </el-select>
              样式风格：
              <el-select
                  v-model="opts.theme"
                  clearable
                  placeholder="请选择"
                  size="mini"
                  @change="changeTheme"
              >
                <el-option
                    v-for="item in sets.theme"
                    :key="item"
                    :label="item"
                    :value="item"
                ></el-option>
              </el-select>
              <el-button type="primary" size="mini" @click="getValue" style="
                margin-left: 10px;
                background: linear-gradient(135deg, #4a5ed0 0%, #4a7ed7 100%);
                border: none;
                color: white;
                box-shadow: 0 2px 6px rgba(74, 94, 208, 0.3);
                transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
              ">提交答案</el-button>
            </div>
            <MonacoEditor
                ref="MonacoEditor"
                :opts="opts"
                @change="changeValue"
                style="height: calc(100vh - 170px); margin-top: 15px;"
            ></MonacoEditor>
          </el-tab-pane>
          <el-tab-pane label="提交文件" name="second">
            <el-upload
                class="upload-demo"
                drag
                action=""
                multiple
                style="display: flex; justify-content: center;">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <div>
              <h3>文件格式要求</h3>
              <span style="line-height: 30px; font-size: 16px;">可以直接提交上传源程序文件。记得先在本地 IDE 上保存。</span>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog
        title="提交记录"
        :visible.sync="dialogVisible"
        top="0"
    >
      <div class="dialog-content">
        <el-table :data="submissionRecords" class="table" height="100%" v-loading="isSubmissionsLoading">
          <el-table-column prop="id" label="提交ID"></el-table-column>
          <el-table-column prop="problem_id" label="题目ID"></el-table-column>
          <el-table-column prop="submit_time" label="提交时间"></el-table-column>
          <el-table-column prop="language" label="编程语言"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column prop="time_used" label="耗时(ms)"></el-table-column>
          <el-table-column prop="memory_used" label="内存使用(KB)"></el-table-column>
          <template #empty>
            <el-empty description="暂无提交记录"></el-empty>
          </template>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MonacoEditor from '@/views/MonacoEditor.vue';
import { languages } from "@/data/languages.js";
import newRequest from '@/utils/newRequest';

// 题目组件脚本
export default {
  name: 'problem',
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      activeName: 'first',
      sets: {
        language: languages,
        theme: {
          '浅色': 'vs',
          '深色': 'vs-dark',
          '高对比度': 'hc-black'
        }
      },
      opts: {
        value: '',
        readOnly: false,
        language: 'cpp',
        theme: 'vs',
        automaticLayout: true,
        minimap: { enabled: true },
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        folding: true,
        multiCursorModifier: 'alt',
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: 'on',
        tabSize: 2,
        renderWhitespace: 'selection',
        wordWrap: 'on'
      },
      isSubmit: false,
      isSidebarCollapsed: false,
      dialogVisible: false,
      submissionRecords: [], // 用于保存提交记录
      problemData: null,
      id: null, // 当前题目ID
      isLoading: false,
      hasError: false,
      isSubmissionsLoading: false,
      hasSubmissionsError: false,
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.fetchProblemData();
  },
  computed: {
    problem() {
      return this.problemData || {
        id: this.id,
        title: '题目' + this.id,
        statement: '',
        tags: [],
        difficulty: '',
        // 其他字段...
      };
    },
    difficultyTagType() {
      switch (this.problem.difficulty) {
        case '简单':
          return 'success';
        case '中等':
          return 'warning';
        case '困难':
          return 'danger';
        default:
          return '';
      }
    }
  },
  components: {
    MonacoEditor
  },
  methods: {
    Submit() {
      this.isSubmit = !this.isSubmit;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    changeLanguage(val) {
      this.opts.language = val;
    },
    changeTheme(val) {
      this.opts.theme = val;
    },
    getValue() {
      // 获取代码
      const code = this.$refs.MonacoEditor.getVal();

      // 获取其他参数
      const problemId = this.problem.id;
      const language = this.opts.language;
      const contestId = 0; // 默认为练习模式

      // 构建提交数据
      const submitData = {
        problem_id: problemId,
        code: code,
        language: language,
        contest_id: contestId
      };

      // 发送提交请求
      newRequest.post('/api/problem/submit', submitData)
          .then(response => {
            this.$message.success('提交成功！');
            console.log('提交响应:', response);
            // 可根据需要处理响应数据，比如显示提交ID等
          })
          .catch(error => {
            this.$message.error('提交失败，请检查代码或网络后重试！');
            console.error('提交错误:', error);
          });
    },
    changeValue(val) {
      console.log(val);
    },
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    fetchProblemData() {
      this.isLoading = true;
      this.hasError = false;
      const requestBody = {
        problem_id: this.id,
      };
      newRequest.post('/api/problem/statement/get', requestBody)
          .then(response => {
            this.problemData = response;
            console.log('题目信息:', response);
          })
          .catch(error => {
            console.error('获取题目信息失败:', error);
            this.hasError = true;
            this.problemData = null;
          })
          .finally(() => {
            this.isLoading = false;
          });
    },
    fetchUserProblemSubmissions() {
      this.dialogVisible = true;
      this.isSubmissionsLoading = true;
      this.hasSubmissionsError = false;

      const userId = this.user.id;
      const problemId = this.problem.id;

      const filterData = {
        user_id: userId,
        problem_id: problemId,
        contest_id: '', // 默认为练习模式
        language: 'cpp',
      };

      newRequest.post('/api/submission/filter', filterData)
          .then(response => {
            this.submissionRecords = response.submissions || [];
            this.dialogVisible = true;
          })
          .catch(error => {
            this.$message.error('获取提交记录失败，请稍后重试！');
            console.error('获取提交记录错误:', error);
            this.hasSubmissionsError = true;
            this.submissionRecords = [];
          })
          .finally(() => {
            this.isSubmissionsLoading = false;
          });
    },
  }
};
</script>

<style scoped>
/* 题目组件样式 */
.problem {
  min-height: calc(100vh - 60px);
  overflow: auto;
  display: flex;
}

.left-part {
  position: relative;
  background-color: #ffffff;
  width: 250px;
  height: calc(100vh - 60px);
  transition: width 0.3s ease;
  overflow: hidden;
}
.left-part.collapsed {
  width: 50px;
}

.container {
  display: flex;
  justify-content: center;
  height: calc(100vh - 60px);
  transition: flex-basis 0.3s ease;
  overflow: auto;
}
.container.expanded {
  flex-basis: calc(100% - 250px);
}
.container.collapsed {
  flex-basis: calc(100% - 50px);
}

.detail {
  position: relative;
  width: 900px;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

.editor {
  background-color: #ffffff;
  position: relative;
  width: 900px;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

.toggle-button {
  position: relative;
  border: none;
  width: 50px;
  height: 30px;
}

.divider {
  width: 96%;
  margin: 0 5px;
}

.divider-collapse {
  width: 96%;
  margin: 0 1px;
}

.goto-button {
  height: 40px;
  margin-top: 20px;
  margin-left: 20px;
  background: linear-gradient(135deg, #4a5ed0 0%, #4a7ed7 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 12px rgba(74, 94, 208, 0.3);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.goto-button:hover {
  background: linear-gradient(135deg, #3a4ec0 0%, #3a6ec7 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(74, 94, 208, 0.4);
}

.goto-button:active {
  transform: translateY(1px);
  box-shadow: 0 4px 8px rgba(74, 94, 208, 0.3);
}

.dialog-content {
  height: 80vh;
  overflow: auto;
  padding: 10px;
}

::v-deep(.el-dialog__wrapper) {
  position: fixed;
  right: 0;
  top: 20px;
  height: 100vh;
  overflow: hidden;
  transition: transform 0.3s ease;
}
::v-deep(.el-dialog__body) {
  height: 85vh;
}

.left-part .toggle-button-container {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
}
</style>