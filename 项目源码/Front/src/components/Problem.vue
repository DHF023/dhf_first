<template>
  <div class="problem">
    <div class="left-part" :class="{ collapsed: isSidebarCollapsed }">
      <div>
        <!--边栏收起状态-->
        <div v-if="isSidebarCollapsed === true">
          <div style="width: 100%; height: 30px;">
            <el-button class="toggle-button" @click="toggleSidebar" plain>
              <i class="el-icon-arrow-right" style="color: #4c4c4c;"></i>
            </el-button>
          </div>
          <el-divider class="divider-collapse"></el-divider>
        </div>

        <!--边栏打开状态-->
        <div v-if="isSidebarCollapsed === false">
          <div class="toggle-button-container">
            <el-button class="toggle-button" @click="toggleSidebar" plain>
              <i class="el-icon-arrow-left" style="color: #4c4c4c;"></i>
            </el-button>
          </div>
          <el-divider class="divider"></el-divider>
          <el-button type="primary" size="medium" class="goto-button" @click="Submit" v-if="isSubmit === false" round>提交答案</el-button>
          <el-button type="primary" size="medium" class="goto-button" @click="Submit" v-if="isSubmit === true" round>返回题目</el-button>
          <el-button type="primary" size="medium" class="goto-button" @click="dialogVisible = true" round>提交记录</el-button>
        </div>
      </div>
    </div>

    <div class="container" :class="{ expanded: !isSidebarCollapsed, collapsed: isSidebarCollapsed }">
      <div class="detail" v-if="isSubmit === false">
        <el-container style="background-color: #ffffff;">
          <el-header style="height: 60px; display: flex;">
            <h2 style="width: 50%">{{ id }} {{ problem.title }}</h2>
          </el-header>
          <el-row style="margin: 10px 0; padding: 0 20px; display: flex; align-items: center;">
            <!-- 难度标签 -->
            <el-tag :type="difficultyTagType" effect="dark" style="border-radius: 20px; margin-right: 10px;">
              {{ problem.difficulty }}
            </el-tag>
            <!-- 标签列表 -->
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
import  MonacoEditor from '@/views/MonacoEditor.vue'
import { languages } from "@/data/languages.js";
import { records } from "@/data/records";

export default {
  name: 'problem',
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
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
      isSubmit: false,
      isSidebarCollapsed: false,
      dialogVisible: false,
      record: records,
    }
  },
  created() {
    this.id = this.$route.params.id; // 从路由参数中获取题目ID
  },
  computed: {
    problem() {
      const problems = require('@/data/problems.js').problems;
      return problems.find(p => p.id === this.id);
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
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
  },
};
</script>

<style scoped>
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
  flex-basis: calc(100% - 250px); /* 展开时右侧区域的宽度 */
}
.container.collapsed {
  flex-basis: calc(100% - 50px); /* 收起时右侧区域的宽度 */
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


.left-part .toggle-button-container {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 使按钮靠右对齐 */
  padding-right: 10px; /* 可选，根据需要添加右侧内边距 */
}
</style>