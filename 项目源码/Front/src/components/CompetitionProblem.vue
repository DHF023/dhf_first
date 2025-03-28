<template>
  <div class="competition-problem">
    <div class="left-part" :class="{ collapsed: isSidebarCollapsed }">
      <div>
        <!-- 边栏收起状态 -->
        <!-- 边栏收起时显示 -->
        <div v-if="isSidebarCollapsed === true">
          <div style="width: 100%; height: 30px;">
            <el-button class="toggle-button" @click="toggleSidebar" plain>
              <i class="el-icon-arrow-right" style="color: #4c4c4c;"></i>
            </el-button>
          </div>
          <el-divider class="divider-collapse"></el-divider>
        </div>

        <!-- 边栏打开状态 -->
        <!-- 边栏展开时显示 -->
        <div v-if="isSidebarCollapsed === false">
          <div style="width: 100%; height: 30px; display: flex; align-items: center;">
            <el-button class="toggle-button" style="margin-left: 200px;" @click="toggleSidebar" plain>
              <i class="el-icon-arrow-left" style="color: #4c4c4c;"></i>
            </el-button>
          </div>
          <el-divider class="divider"></el-divider>
          <div>
            <el-table :data="competitionProblems">
              <el-table-column prop="id" label="#" width="40"></el-table-column>
              <el-table-column prop="title" label="标题">
                <template v-slot="scope">
                  <a href="javascript:void(0);" @click="openCompetitionProblemDetail(scope.row.id)" class="title-link">{{ scope.row.title }}</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-button type="primary" size="medium" class="goto-button" @click="Submit" v-if="isSubmit === false" round>提交答案</el-button>
          <el-button type="primary" size="medium" class="goto-button" @click="Submit" v-if="isSubmit === true" round>返回题目</el-button>
          <el-button type="primary" size="medium" class="goto-button" @click="dialogVisible = true" round>提交记录</el-button>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main" :class="{ expanded: !isSidebarCollapsed, collapsed: isSidebarCollapsed }">
      <div class="detail" v-if="isSubmit === false">
        <el-container style="background-color: #ffffff;">
          <el-header style="height: 60px; display: flex;">
            <h2 style="width: 50%">{{ problemDetail.id }} {{ problemDetail.title }}</h2>
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
              ><el-option
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
              ><el-option
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
              <div class="el-upload__tip" slot="tip">

              </div>
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
        <el-table :data="record" class="table" height="100%">
          <el-table-column prop="state" label="状态"></el-table-column>
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="title" label="题目"></el-table-column>
          <el-table-column prop="time" label="完成时间"></el-table-column>
          <el-table-column prop="num" label="提交次数"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { competitionProblems } from "@/data/competition-problems.js";
import  MonacoEditor from '@/views/MonacoEditor.vue'
import { records } from "@/data/records";
import {languages} from "@/data/languages";

export default {
  name: 'competition-problem',
  props: ['id'],
  data () {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      isSidebarCollapsed: false,
      competitionProblems: competitionProblems,
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
        readOnly: false, // 是否可编辑
        language: 'javascript', // 语言类型
        theme: 'vs' // 编辑器主题
      },
      record: records,
      dialogVisible: false,
    }
  },
  computed: {
    problemDetail() {
      return this.competitionProblems.find(problem => problem.id === this.id) || {};
    }
  },
  components: {
    MonacoEditor
  },
  methods: {
    // 切换边栏的展开和收起状态
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    openCompetitionProblemDetail(competitionProblemId) {
      if (this.$route.params.id !== competitionProblemId) {
        this.$router.push({ name: 'CompetitionProblemDetail', params: { id: competitionProblemId } });
      }
    },
    Submit() {
      this.isSubmit = !this.isSubmit;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    changeLanguage (val) {
      this.opts.language = val
    },
    changeTheme (val) {
      this.opts.theme = val
    },
    // 手动获取值
    getValue () {
      this.$message.info('代码已输出至控制台');
      console.log('输出代码:' + this.$refs.monaco.getVal())
    },
    // 内容改变自动获取值
    changeValue (val) {
      console.log(val)
    },
  },
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
  text-decoration: none; /* 去掉下划线 */
  color: #dba800; /* 更改字体颜色，这里以绿色为例 */
}

.main {
  display: flex;
  justify-content: center;
  height: calc(100vh - 60px);
  transition: flex-basis 0.3s ease;
  overflow: auto;
}
.main.expanded {
  flex-basis: calc(100% - 250px); /* 展开时右侧区域的宽度 */
}
.main.collapsed {
  flex-basis: calc(100% - 50px); /* 收起时右侧区域的宽度 */
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
  height: 80vh; /* 占据对话框的全部高度 */
  overflow: auto; /* 启用垂直滚动条 */
  padding: 10px; /* 添加内边距，使内容不贴边 */
}
.dialog-content::-webkit-scrollbar {
  display: none;
}

::v-deep(.el-dialog__wrapper) {
  position: fixed; /* 固定定位 */
  right: 0; /* 右侧对齐 */
  top: 20px; /* 假设导航栏高度为60px，根据实际情况调整 */
  height: 100vh; /* 高度设置为视口高度的90% */
  overflow: hidden; /* 隐藏对话框本身的滚动条，滚动将由内部内容控制 */
  transition: transform 0.3s ease; /* 添加过渡效果，使对话框滑出更平滑 */
}
::v-deep(.el-dialog__body) {
  height: 85vh; /* 使对话框高度充满整个对话框容器 */
}

::v-deep(.el-table__body-wrapper) {
  scrollbar-width: none;
}
</style>
