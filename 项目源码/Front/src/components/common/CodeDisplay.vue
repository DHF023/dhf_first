<template>
  <div class="code-display" :class="theme">
    <div class="code-header">
      <span class="language-tag">{{ language }}</span>
      <div>
        <el-button
          size="mini"
          class="theme-button"
          @click="toggleTheme"
          :icon="themeIcon"
        ></el-button>
        <el-button
          size="mini"
          class="copy-button"
          @click="copyToClipboard"
          icon="el-icon-document-copy"
        ></el-button>
      </div>
    </div>
    <div class="code-content">
      <div class="line-numbers">
        <span v-for="n in lineCount" :key="n">{{ n }}</span>
      </div>
      <pre><code :class="'language-' + language">{{ code }}</code></pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CodeDisplay',
  props: {
    code: {
      type: String,
      required: true
    },
    language: {
      type: String,
      default: 'javascript'
    }
  },
  data() {
    return {
      theme: 'light' // 'light' or 'dark'
    }
  },
  computed: {
    lineCount() {
      return this.code.split('\n').length;
    },
    themeIcon() {
      return this.theme === 'light' ? 'el-icon-moon' : 'el-icon-sunny';
    }
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.code)
        .then(() => {
          this.$message.success('代码已复制到剪贴板');
        })
        .catch(err => {
          console.error('复制失败:', err);
          this.$message.error('复制失败');
        });
    },
    mounted() {
      // 测试代码 - 临时添加
      if (this.code === '') {
        this.$emit('update:code', `function example() {\n  console.log("Hello World");\n  return 42;\n}\n\n// 这是一个测试代码块`);
      }
    }
  }
}
</script>

<style scoped>
.code-display {
  border-radius: 4px;
  margin: 8px 0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.code-display.light {
  background-color: #ffffff;
  border-left: 3px solid #5585d7;
}

.code-display.dark {
  background-color: #2d2d2d;
  border-left: 3px solid #666;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  transition: all 0.3s ease;
}

.code-display.light .code-header {
  background-color: #f8fafc;
  border-bottom: 1px solid #e0f0ff;
}

.code-display.dark .code-header {
  background-color: #1e1e1e;
  border-bottom: 1px solid #333;
}

.language-tag {
  font-size: 12px;
  color: #666;
}

.copy-button {
  padding: 4px;
  min-width: 24px;
  height: 24px;
}

.code-content {
  display: flex;
  overflow: hidden;
  transition: all 0.3s ease;
}

.code-display.light .code-content {
  background-color: #ffffff;
}

.code-display.dark .code-content {
  background-color: #2d2d2d;
}

.line-numbers {
  padding: 12px 4px 12px 12px;
  text-align: right;
  user-select: none;
  transition: all 0.3s ease;
}

.code-display.light .line-numbers {
  background-color: #f8fafc;
  border-right: 1px solid #e0f0ff;
}

.code-display.dark .line-numbers {
  background-color: #1e1e1e;
  border-right: 1px solid #333;
}

.line-numbers span {
  display: block;
  font-size: 14px;
  line-height: 1.6;
  font-family: 'SF Mono', 'Menlo', 'Consolas', 'Roboto Mono', monospace;
}

.code-display.light .line-numbers span {
  color: #999;
}

.code-display.dark .line-numbers span {
  color: #666;
}

pre {
  margin: 0;
  padding: 12px;
  overflow-x: auto;
  flex: 1;
}

code {
  font-family: 'SF Mono', 'Menlo', 'Consolas', 'Roboto Mono', monospace;
  white-space: pre-wrap;
  line-height: 1.6;
  font-size: 14px;
  letter-spacing: 0.2px;
  transition: all 0.3s ease;
}

.code-display.light code {
  color: #333;
}

.code-display.dark code {
  color: #d4d4d4;
}

.theme-button {
  padding: 4px;
  min-width: 24px;
  height: 24px;
  margin-right: 4px;
}
</style>
