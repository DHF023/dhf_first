<template>
  <div class="competition-problem">
    <div class="left-part" :class="{ collapsed: isSidebarCollapsed }">
      <div>
        <div v-if="isSidebarCollapsed">
          <!-- 边栏收起状态，显示展开按钮 -->
          <div style="width: 100%; height: 30px;">
            <el-button class="toggle-button" @click="toggleSidebar" plain>
              <i class="el-icon-arrow-right" style="color: #4c4c4c;"></i>
            </el-button>
          </div>
          <el-divider class="divider-collapse"></el-divider>
        </div>

        <div v-else>
          <!-- 边栏打开状态，显示题目列表和其他按钮 -->
          <div style="width: 100%; height: 30px; display: flex; align-items: center;">
            <el-button class="toggle-button" style="margin-left: 200px;" @click="toggleSidebar" plain>
              <i class="el-icon-arrow-left" style="color: #4c4c4c;"></i>
            </el-button>
          </div>
          <el-divider class="divider"></el-divider>
          <div>
            <el-table :data="competitionProblems" style="width: 100%;">
              <el-table-column prop="problemId" label="#" width="40"></el-table-column>
              <el-table-column prop="title" label="标题">
                <template v-slot="scope">
                  <a href="javascript:void(0);" @click="openCompetitionProblemDetail(scope.row.problemId)" class="title-link">题目{{ scope.row.problemId }}</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-button type="primary" size="medium" class="goto-button" @click="Submit" v-if="isSubmit === false" round>提交答案</el-button>
          <el-button type="primary" size="medium" class="goto-button" @click="Submit" v-if="isSubmit === true" round>返回题目</el-button>
          <el-button type="primary" size="medium" class="goto-button" @click="showSubmissionRecords" round>提交记录</el-button>
        </div>
      </div>
    </div>

    <div class="main" :class="{ expanded: !isSidebarCollapsed, collapsed: isSidebarCollapsed }">
      <div class="detail" v-if="isSubmit === false">
        <!-- 题目详情区域 -->
        <el-container style="background-color: #ffffff;">
          <el-header style="height: 60px; display: flex;">
            <div>
              <h2>{{ problemId }} 题目{{ problemId }}</h2>
            </div>
          </el-header>
          <el-main style="margin-bottom: 30px;">
            <h2>题目背景</h2>
            <div>
              <p>这是题目背景</p>
            </div>
            <h2>题目描述</h2>
            <div>
              <p>这是题目描述</p>
            </div>
            <h2>输入格式</h2>
            <div>
              <p>这是输入格式</p>
            </div>
            <h2>输出格式</h2>
            <div>
              <p>这是输出格式</p>
            </div>
            <h2>输入输出样例</h2>
            <div>
              <p>输入样例</p>
              <pre class="example">1</pre>
              <p>输出样例</p>
              <pre class="example">2</pre>
            </div>
            <h2>说明/提示</h2>
            <div>
              <p>这是说明/提示</p>
            </div>
          </el-main>
        </el-container>
      </div>
      <div class="editor" v-if="isSubmit === true">
        <!-- 提交代码和文件区域 -->
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
              <el-button type="primary" size="mini" @click="getValue" style="margin-left: 10px;">提交答案</el-button>
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
              <span style="line-height: 30px; font-size: 16px;">可以直接提交上传源程序文件。记得先在本地 IDE 上保存。<br>
                  对于 C++ 语言，建议手动选择自己使用的 C++ 标准版本。<br>
                  提交答案题必须提交一个 zip 压缩包，内部按照测试点编号顺序，放置答案的文本文件。<br>
                  建议按照一定规则对答案进行命名，方便系统识别。</span>
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
        <el-table :data="submissionRecords" class="table" height="100%">
          <el-table-column prop="submission_id" label="提交ID"></el-table-column>
          <el-table-column prop="problem_id" label="题目ID"></el-table-column>
          <el-table-column prop="submit_time" label="提交时间"></el-table-column>
          <el-table-column prop="language" label="编程语言"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column prop="time_used" label="耗时(ms)"></el-table-column>
          <el-table-column prop="memory_used" label="内存使用(MB)"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MonacoEditor from '@/views/MonacoEditor.vue';
import { languages } from "@/data/languages";
import newRequest from '@/utils/newRequest';

export default {
  name: 'competition-problem',
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      isSidebarCollapsed: false,
      isSubmit: false,
      activeName: 'first',
      sets: {
        language: languages,
        theme: {
          'vs': 'vs',
          'vs-dark': 'vs-dark',
          'hc-black': 'hc-black'
        }
      },
      opts: {
        value: '',
        readOnly: false,
        language: 'cpp',
        theme: 'vs'
      },
      dialogVisible: false,
      competitionProblems: [],
      submissionRecords: [],
      contestId: null,
      problemId: null, // 存储当前题目ID
    };
  },
  components: {
    MonacoEditor
  },
  methods: {
    toggleSidebar() {
      // 切换边栏的收起/展开状态
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    openCompetitionProblemDetail(problemId) {
      // 打开题目详情或刷新提交记录
      if (this.$route.params.problemId === problemId.toString()) {
        this.fetchSubmissionRecords();
      } else {
        const targetRoute = {
          name: 'CompetitionProblem',
          params: { contestId: this.$route.params.contestId, problemId }
        };
        this.$router.push(targetRoute);
      }
    },
    Submit() {
      // 切换提交答案/返回题目状态
      this.isSubmit = !this.isSubmit;
    },
    handleClick(tab, event) {
      // 处理标签页点击事件
      console.log(tab, event);
    },
    changeLanguage(val) {
      // 更改编程语言
      this.opts.language = val;
    },
    changeTheme(val) {
      // 更改样式风格
      this.opts.theme = val;
    },
    getValue() {
      // 获取编辑器中的代码
      const code = this.$refs.MonacoEditor.getVal();

      // 构建提交数据
      const submitData = {
        problem_id: this.problemId,
        code: code,
        language: this.opts.language,
        contest_id: this.contestId,
      };

      // 发送提交请求
      newRequest.post('/api/problem/submit', submitData)
          .then(response => {
            this.$message.success('提交成功！');
            console.log('提交响应:', response);
            // 根据需要处理响应数据，比如显示提交ID等
          })
          .catch(error => {
            this.$message.error('提交失败，请检查代码或网络后重试！');
            console.error('提交错误:', error);
          });
    },
    changeValue(val) {
      // 处理编辑器内容变化事件
      console.log(val);
    },
    fetchContestInfo() {
      // 获取比赛信息
      const contestId = parseInt(this.$route.params.contestId, 10);
      this.contestId = contestId;

      newRequest.get(`/api/contest/getinfo/${contestId}`)
          .then(response => {
            this.competitionProblems = response.problem_ids.map(problemId => ({ problemId, title: `题目${problemId}` }));
          })
          .catch(error => {
            console.error('Failed to fetch contest info:', error);
          });
    },
    fetchSubmissionRecords() {
      // 获取提交记录
      const contestId = this.$route.params.contestId;

      newRequest.get(`/api/contest/get_contest_user_submission/${contestId}`)
          .then(response => {
            this.submissionRecords = response;
            console.log('提交记录:', this.submissionRecords);
          })
          .catch(error => {
            console.error('Failed to fetch submission records:', error);
          });
    },
    showSubmissionRecords() {
      // 显示提交记录对话框
      this.fetchSubmissionRecords();
      this.dialogVisible = true;
    }
  },
  created() {
    // 组件创建时获取比赛信息和题目ID
    this.fetchContestInfo();
    this.problemId = parseInt(this.$route.params.problemId, 10);
  },
  watch: {
    '$route'(to, from) {
      // 监听路由变化，更新题目ID并刷新页面
      this.problemId = parseInt(to.params.problemId, 10);
      window.location.reload();
    }
  }
};
</script>

<style scoped>
.competition-problem {
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

.title-link {
  text-decoration: none;
  color: #dba800;
}

.main {
  display: flex;
  justify-content: center;
  height: calc(100vh - 60px);
  transition: flex-basis 0.3s ease;
  overflow: auto;
}
.main.expanded {
  flex-basis: calc(100% - 250px);
}
.main.collapsed {
  flex-basis: calc(100% - 50px);
}

.goto-button {
  height: 40px;
  margin-top: 20px;
  margin-left: 20px;
}

.detail {
  position: relative;
  width: 900px;
  left: 0;
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

.example {
  border: 1px solid #c1c1c1;
  background-color: #eaeaea;
  border-radius: 2px;
  overflow: auto;
  padding: .375em .5em;
  width: 200px;
}

.dialog-content {
  height: 80vh;
  overflow: auto;
  padding: 10px;
}
.dialog-content::-webkit-scrollbar {
  display: none;
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

::v-deep(.el-table__body-wrapper) {
  scrollbar-width: none;
}
</style>