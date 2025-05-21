<template>
  <div class="code-display">
    <div class="code-header">
      <span class="language-tag">{{ language }}</span>
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
  computed: {
    lineCount() {
      return this.code.split('\n').length;
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
}

.code-display {
  background-color: #ffffff;
  border-left: 3px solid #5585d7;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e0f0ff;
}

.language-tag {
  font-size: 12px;
  color: #666;
}

.code-content {
  display: flex;
  overflow: hidden;
}

.line-numbers {
  padding: 12px 4px 12px 12px;
  text-align: right;
  user-select: none;
  background-color: #f8fafc;
  border-right: 1px solid #e0f0ff;
}

.line-numbers span {
  display: block;
  font-size: 14px;
  line-height: 1.6;
  font-family: 'SF Mono', 'Menlo', 'Consolas', 'Roboto Mono', monospace;
  color: #999;
}

pre {
  margin: 0;
  padding: 12px;
  overflow-x: auto;
  flex: 1;
  background-color: #ffffff;
}

code {
  font-family: 'SF Mono', 'Menlo', 'Consolas', 'Roboto Mono', monospace;
  white-space: pre-wrap;
  line-height: 1.6;
  font-size: 14px;
  letter-spacing: 0.2px;
  color: #333;
}
</style>
