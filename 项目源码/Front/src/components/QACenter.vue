<template>
  <div class="center">
    <div class="left-part" :class="{ collapsed: isSidebarCollapsed }">
      <div>
        <!--边栏收起状态-->
        <div v-if="isSidebarCollapsed === true">
          <div class="toggle-container">
            <el-button class="toggle-button" @click="toggleSidebar" plain>
              <i class="el-icon-arrow-right toggle-icon"></i>
            </el-button>
          </div>

          <el-divider class="divider-collapse"></el-divider>

          <div class="add-collapse">
            <el-button type="primary" class="add-button-collapse" @click="createNewConversation">
              <i class="el-icon-plus" style="font-size: 16px;"></i>
            </el-button>
          </div>
        </div>

        <!--边栏打开状态-->
        <div v-if="isSidebarCollapsed === false">
          <div class="toggle-container">
            <el-button class="toggle-button" @click="toggleSidebar" plain>
              <i class="el-icon-arrow-left toggle-icon"></i>
            </el-button>
          </div>

          <el-divider class="divider"></el-divider>

          <div class="add-open">
            <el-button type="primary" class="add-button-open" @click="createNewConversation">
              <div class="add-button-content">
                <i class="el-icon-plus" style="font-size: 16px; margin-right: 8px;"></i>
                <span class="add-button-text">新对话</span>
              </div>
            </el-button>
          </div>

          <el-divider class="divider"></el-divider>

          <template v-if="!isLoadingConversations">
            <div v-if="conversations.length > 0">
              <div class="conversation-list-container">
                <div v-for="(conversation, index) in conversations" :key="conversation.id"
                     class="conversation-item"
                     @click="isBatchMode ? toggleSelectConversation(index) : loadMessages(index)"
                     :class="{ active: activeConversation === index }">
                  <el-avatar :size="32" class="conversation-avatar">C</el-avatar>
                  <div class="conversation-content">
                    <div class="conversation-title">{{ conversation.title }}</div>
                    <div class="conversation-preview">点击查看对话详情</div>
                    <el-button
                        v-if="!isBatchMode"
                        @click.stop="deleteConversation(index)"
                        class="delete-button"
                        type="text"
                        size="mini"
                    >
                      <i class="el-icon-delete"></i>
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-tip">
              <el-empty description="暂无对话数据"></el-empty>
              <confirm-dialog
                ref="deleteDialog"
                title="删除对话确认"
                message="确定要删除这个对话吗？"
                :on-confirm="confirmDeleteConversation"
              />
            </div>
          </template>
          <div v-if="isLoadingConversations" class="conversation-loading">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <el-divider class="divider"></el-divider>
        </div>
      </div>
    </div>

    <div class="right-part" :class="{ expanded: !isSidebarCollapsed, collapsed: isSidebarCollapsed }">
      <div class="right-content">
        <div v-if="isNewDialog === false">
          <div class="answer-part">
            <div class="answer-container">
              <div v-for="(msg, index) in messages" :key="index">
                <div v-if="msg.from === 'user'" class="message-container-user">
                  <el-avatar
                      :src="'http://localhost:8080/api/files/' + avatarUrl"
                      :size="40"
                      style="border-radius: 50%; overflow: hidden; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                  ></el-avatar>
                  <div class="message-text">
                    <p v-html="msg.content"></p>
                    <div class="message-meta">
                      <span>{{ new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
                      <span>
                        <i class="el-icon-check"></i> 已发送

                        <el-tooltip content="复制到输入框" placement="top">
                          <el-button
                              size="mini"
                              circle
                              @click="copyToInput(msg.content)"
                          >
                            <i class="el-icon-document-copy"></i>
                          </el-button>
                        </el-tooltip>
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else-if="msg.from === 'ai'" class="message-container-ai">
                  <el-avatar :size="40" style="background-color:#4a5ed0;color:white">AI</el-avatar>
                  <div class="answer-main">
                    <div v-if="editingMessageId === index" class="edit-container">
                      <el-input
                          type="textarea"
                          v-model="editContent"
                          :autosize="{ minRows: 2 }"
                          placeholder="编辑消息"
                      ></el-input>
                      <div class="edit-actions">
                        <el-button size="mini" @click="saveEdit(index)">保存</el-button>
                        <el-button size="mini" plain @click="cancelEdit">取消</el-button>
                      </div>
                    </div>
                    <div class="ai-response">
                      <template v-for="(part, index) in parseMessage(msg.content)">
                        <code-display
                            v-if="part.isCode"
                            :key="'code-'+index"
                            :language="part.language"
                            :code="part.content"
                        ></code-display>
                        <div v-else :key="'text-'+index" v-html="formatAIResponse(part.content)"></div>
                      </template>
                    </div>
                    <div class="message-meta">
                      <span>{{ new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="isLoading" class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          <div class="ask-part">
            <div class="model-selector-container">
              <el-select
                  v-model="currentModel"
                  placeholder="选择AI模型"
                  size="small"
                  style="width: 150px; margin-bottom: 10px;"
                  @change="handleModelChange">
                <el-option
                    v-for="model in availableModels"
                    :key="model.value"
                    :label="model.label"
                    :value="model.value">
                </el-option>
              </el-select>
            </div>
            <textarea
                id="textarea"
                v-model="textarea"
                rows="5"
                cols="90"
                placeholder="请在这里输入问题的详细描述(shift+Enter换行)"
                @keyup="handleKeyup"
                class="textarea-part"
            ></textarea>
            <el-button type="primary" class="promotion-button" round @click="promote">
              <i class="el-icon-s-promotion promotion-icon"></i>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import newQARequest from '../utils/newQARequest';
import CodeDisplay from './common/CodeDisplay';
import ConfirmDialog from './common/ConfirmDialog';

export default {
  name: 'qa-center',
  components: {
    CodeDisplay,
    ConfirmDialog
  },
  data() {
    return {
      textarea: '',
      message: '',
      AImessage: '稍等一会，AI正在思考……',
      formattedMessage: '', // 用于存储已经转换为<br>标签的消息
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      isSidebarCollapsed: false,
      conversationIds: [],
      conversations: [],
      messages: [],
      isNewDialog: false,
      activeConversation: null,
      isLoading: false,
      editingMessageId: null, // 正在编辑的消息ID
      editContent: '', // 编辑中的内容
      showLoadError: false, // 是否显示加载错误
      selectedConversations: [], // 选中的对话
      isLoadingConversations: false, // 是否正在加载对话列表
      currentModel: 'DeepSeek', // 默认模型
      availableModels: [
        { value: 'DeepSeek', label: 'DeepSeek' },
        { value: 'Qwen', label: '通义千问' },
        { value: 'Spark', label: '星火大模型' }
      ],
      deletingIndex: null // 当前正在删除的对话索引
    }
  },
  mounted() {
    console.log('CodeDisplay组件已注册:', this.$options.components.CodeDisplay); // 调试日志
    this.loadConversations();
    this.$nextTick(() => {
      this.scrollToBottom();
    });
  },
  watch: {
    textarea(newVal) {
      this.formattedMessage = this.convertNewlinesToBr(newVal);
    }
  },
  computed: {
    avatarUrl() {
      return this.user.avatar;
    }
  },
  methods: {
    loadConversations(loadFirst = false) {
      const userId = this.user.id;
      console.log('当前用户ID:', userId);
      if (!userId) {
        console.error('用户未登录或ID无效');
        return;
      }

      this.isLoadingConversations = true;

      newQARequest.get('/conversations', {
        params: {user_id: userId}
      }).then(res => {
        console.log('API响应数据:', res.data);
        if (res.data && res.data.length > 0) {
          this.conversations = res.data.map(item => ({
            id: item.id,
            title: item.title || `对话 ${item.id}`
          }));
          console.log('加载的对话列表:', this.conversations);
          if(loadFirst && this.conversations.length > 0) {
            this.loadMessages(0);
            this.activeConversation = 0;
          }
        } else {
          console.log('API返回空对话列表');
          this.conversations = [];
        }
      }).catch(err => {
        console.error("获取对话列表失败:", err);
        this.conversations = [];
      }).finally(() => {
        this.isLoadingConversations = false;
      });
    },
    createNewConversation() {
      const userId = this.user.id;
      newQARequest.post('/conversations', {user_id: userId})
          .then(res => {
            const newConversation = {
              id: res.data.conversation_id,
              title: `新对话 ${res.data.conversation_id}`
            };
            this.conversations.push(newConversation);
            const newIndex = this.conversations.length - 1;
            this.loadMessages(newIndex); // 加载新创建的对话的消息
            this.activeConversation = newIndex;
          }).catch(err => {
        console.error("创建新对话失败：", err);
      });
    },
    loadMessages(index) {
      this.activeConversation = index;
      const conversationId = this.conversations[index].id;  // 获取对应对话ID
      newQARequest.get('/messages', {
        params: {conversation_id: conversationId}
      }).then(res => {
        const messages = res.data;
        console.log(messages);

        // 测试代码块 - 临时添加
        if (messages && Array.isArray(messages) && messages.length === 0) {
          this.messages = [{
            from: 'ai',
            content: '这是一个测试代码块：\n```javascript\nconsole.log("Hello World");\n```\n请检查是否正常显示'
          }];
        } else if (messages && Array.isArray(messages)) {
          this.messages = messages;
        } else {
          console.error("返回数据格式错误:", messages);
        }
      }).catch(err => {
        console.error("加载消息失败：", err);
      });
    },
    deleteConversation(index) {
      this.deletingIndex = index;
      this.$refs.deleteDialog.show();
    },

    confirmDeleteConversation() {
      const conversationId = this.conversations[this.deletingIndex].id;
      newQARequest.delete(`/conversations/${conversationId}`)
          .then(res => {
            this.$message.success('删除成功');
            this.loadConversations(true);
          })
          .catch(err => {
            console.error("删除失败:", err);
            this.$message.error('删除失败: ' + (err.response?.data?.message || err.message));
          });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$el.querySelector('.answer-container');
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        }
      });
    },

    handleModelChange(model) {
      this.currentModel = model;
      const modelName = this.availableModels.find(m => m.value === model)?.label || model;
      this.$message.success(`已切换至 ${modelName}`);
      localStorage.setItem('preferredModel', model);

      // 可以在这里添加模型切换后的额外逻辑
      if (this.activeConversation !== null) {
        this.loadMessages(this.activeConversation);
      }
    },
    promote() {
      const userId = this.user.id;
      const question = this.textarea;
      const conversationId = this.conversationIds[this.activeConversation];

      // 把用户提问加入 messages 列表
      this.messages.push({from: 'user', content: this.formattedMessage});
      this.isLoading = true;
      this.textarea = "";
      this.scrollToBottom();

      newQARequest.post('/ask', {
        user_id: userId,
        question: question,
        conversation_id: conversationId
      }).then(res => {
        const aiAnswer = res.data.answer;
        this.messages.push({from: 'ai', content: aiAnswer}); // 添加 AI 回复
        this.scrollToBottom();
      }).finally(() => {
        this.isLoading = false;
        this.scrollToBottom();
      });
    },
    handleKeyup(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        // 普通 Enter 键被按下，发送消息
        this.promote();
      }
    },
    convertNewlinesToBr(text) {
      return text.replace(/\r?\n/g, '<br>');
    },
    copyToInput(content) {
      // 移除HTML标签并转换<br>为换行
      const plainText = content.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
      this.textarea = plainText;
      this.$nextTick(() => {
        document.getElementById('textarea').focus();
      });
    },

    formatAIResponse(content) {
      // 处理分割线
      let formatted = content.replace(/^---$/gm, '<hr style="border-top: 1px dashed #ccc; margin: 16px 0;">');

      // 处理标题
      formatted = formatted.replace(/^### (.*$)/gm, '<h3 style="font-size:1.2em;margin:16px 0 8px;">$1</h3>');
      formatted = formatted.replace(/^#### (.*$)/gm, '<h4 style="font-size:1.1em;margin:12px 0 6px;">$1</h4>');

      // 处理表格
      formatted = formatted.replace(/^\|([^\n]*\|[^\n]*)\n\|\s*[-:]+\s*(?:\|[-\s:]+)*\s*\|\n((?:\|.*\|\n?)+)/gm, (match, header, body) => {
        // 处理表头
        const headers = header.split('|')
          .map(h => h.trim())
          .filter(h => h.length > 0);

        // 处理表格内容
        const rows = body.split('\n')
          .filter(row => row.trim().length > 0)
          .map(row => {
            return row.split('|')
              .map(cell => cell.trim())
              .filter((cell, i) => i > 0 && i < headers.length + 1); // 跳过首尾空列
          });

        // 构建HTML表格
        let html = `<table style="width:100%;border-collapse:collapse;margin:12px 0;border:1px solid #ddd;">`;

        // 添加表头
        html += `<thead><tr>`;
        headers.forEach(header => {
          html += `<th style="padding:8px;border:1px solid #ddd;text-align:center;background:#f5f5f5;">${header}</th>`;
        });
        html += `</tr></thead>`;

        // 添加表格内容
        html += `<tbody>`;
        rows.forEach(row => {
          html += `<tr>`;
          row.forEach(cell => {
            html += `<td style="padding:8px;border:1px solid #ddd;">${cell}</td>`;
          });
          html += `</tr>`;
        });
        html += `</tbody></table>`;

        return html;
      });

      // 处理列表项
      formatted = formatted.replace(/^· (.*$)/gm, '<li style="margin-left:20px;">$1</li>');
      formatted = formatted.replace(/^  - /gm, '<li style="margin-left:30px;list-style-type:circle;">');

      // 处理加粗文本
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // 处理代码标记
      formatted = formatted.replace(/`(.*?)`/g, '<span class="formula-text">$1</span>');

      // 处理换行
      formatted = formatted.replace(/\n/g, '<br>');

      return formatted;
    },
    parseMessage(content) {
      const parts = [];
      const segments = content.split(/```([a-z]*)\n?([\s\S]*?)```/g);

      for (let i = 0; i < segments.length; i++) {
        if (i % 3 === 0 && segments[i]) {
          parts.push({
            isCode: false,
            content: segments[i]
          });
        } else if (i % 3 === 1) {
          parts.push({
            isCode: true,
            language: segments[i] || 'javascript',
            content: segments[i+1]
          });
          i++;
        }
      }

      return parts.length ? parts : [{ isCode: false, content }];
    },

    escapeHtml(unsafe) {
      return unsafe
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
    },
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },

  }
}
</script>

<style scoped>
.formula-text {
  font-family: 'Courier New', monospace;
  background-color: #f5f5f5;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.95em;
}

.el-button .el-icon-document-copy {
  color: #000000;
  font-size: 14px;
}
.el-button .el-icon-delete {
  color: #000000;
  font-size: 14px;
}

.center {
  height: calc(100vh - 60px);
  max-height: calc(100vh - 60px);
  display: flex;
  background-color: #f7f7f8;
  overflow: hidden;
}

.left-part {
  width: 260px;
  height: 100%;
  background-color: #ffffff;
  border-right: 1px solid #e5e5e6;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.left-part.collapsed {
  width: 60px;
}

.right-part {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f7f7f8;
}

.right-content {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px 0 10px;
}

.answer-part {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  width: 100%;
  flex: 1;
  min-height: 60vh;
  max-height: calc(100vh - 250px);
  overflow: hidden;
  padding: 20px 0 20px 16px;
}

.ask-part {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 120px;
  max-height: 30vh;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0f0ff;
  transition: border-color 0.2s ease;
}

@media (max-height: 800px) {
  .answer-part {
    min-height: 55vh;
    margin: 5px 0;
  }
  .ask-part {
    min-height: 100px;
    margin: 20px 0;
  }
}

@media (max-height: 600px) {
  .answer-part {
    min-height: 50vh;
  }
}

.ask-part:focus-within {
  border-color: #1a73e8;
}

.answer-container {
  width: 100%;
  padding: 0;
  overflow-y: auto;
  height: calc(100% - 20px);
  max-height: 49vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scrollbar-width: none;
}

.answer-container::-webkit-scrollbar {
  width: 6px;
  background: transparent;
}

.answer-container::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 3px;
}

.answer-container:hover::-webkit-scrollbar-thumb {
  background: #c1c1c1;
}

@media (max-height: 800px) {
  .answer-container {
    height: calc(100% - 10px);
  }
}

.answer-container::-webkit-scrollbar {
  width: 6px;
  margin: 8px 0;
}

.answer-container::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 0;
  margin: 0;
}

.answer-container::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 3px;
  margin: 8px 0;
}

.toggle-container {
  width: 100%;
  height: 40px;
  padding: 4px 0;
}

.toggle-button {
  position: relative;
  border: none;
  width: 40px;
  height: 40px;
  float: right;
  background-color: transparent;
  transition: all 0.2s;
}

.toggle-button:hover {
  background-color: #f5f5f5;
}

.toggle-icon {
  color: #666;
  font-size: 18px;
}

textarea {
  resize: none;
  width: 100%;
  min-height: 80px;
  padding: 12px 16px;
  font-size: 15px;
  border: none;
  border-radius: 0;
  outline: none;
  transition: box-shadow 0.2s ease;
}

.add-button-open {
  position: relative;
  border-radius: 8px;
  width: 100%;
  height: 48px;
  margin: 16px 0;
  background: linear-gradient(135deg, #4a5ed0 0%, #5585d7 100%);
  border: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 6px rgba(74, 94, 208, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #4a5ed0 0%, #5585d7 50%, #4a5ed0 100%);
  background-size: 200% 100%;
}

.add-button-open:hover {
  background-position: 100% 0;
}

.add-button-open:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(74, 94, 208, 0.3);
  background: linear-gradient(135deg, #4a5ed0 0%, #5585d7 100%);
}

.add-button-open:active {
  transform: translateY(1px);
}

/* 收起状态按钮样式 */
.add-button-collapse {
  position: relative;
  width: 40px;
  height: 40px;
  margin: 16px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #4a5ed0 0%, #5585d7 100%);
  border-radius: 8px;
  border: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 6px rgba(74, 94, 208, 0.2);
  color: white;
}

.add-button-collapse:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(74, 94, 208, 0.3);
  background: linear-gradient(135deg, #4a5ed0 0%, #5585d7 100%);
}

.add-button-collapse:active {
  transform: translateY(1px);
}

/* 按钮内容通用样式 */
.add-button-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-button-text {
  font-size: 18px;
  margin-left: 3px;
}

.promotion-button {
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #4a5ed0 0%, #5585d7 50%, #4a5ed0 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(74, 94, 208, 0.3);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background-size: 200% 100%;
}

.promotion-button:hover {
  background-position: 100% 0;
}

.promotion-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 94, 208, 0.4);
  background: linear-gradient(135deg, #4a5ed0 0%, #5585d7 100%);
}

.promotion-button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 4px rgba(74, 94, 208, 0.2);
}

.promotion-icon {
  font-size: 20px;
  color: white;
  transition: transform 0.2s;
}

.promotion-button:hover .promotion-icon {
  transform: scale(1.1);
}

.message-container-user {
  display: flex;
  margin: 0;
  padding: 16px 24px;
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  max-width: 85%;
  align-self: flex-end;
}

.message-container-user::before {
  content: '';
  position: absolute;
  right: -8px;
  top: 16px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-left-color: #ffffff;
  border-right: 0;
}

.message-container-ai {
  display: flex;
  margin: 0;
  padding: 16px 24px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f7ff 100%);
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  max-width: 85%;
}

.message-container-ai::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 16px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-right-color: #f0f7ff;
  border-left: 0;
}

.ai-response {
  line-height: 1.6;
  white-space: pre-wrap;
}

.ai-response br {
  display: block;
  margin-bottom: 8px;
  content: "";
}

.ai-response >>> .code-display {
  margin: 12px 0;
}

.ai-response >>> .code-display.light {
  background-color: #ffffff !important;
}

.ai-response >>> .code-display.dark {
  background-color: #2d2d2d !important;
}

.ai-response >>> .code-content {
  background: inherit !important;
}

.message-text {
  margin-left: 16px;
  width: 100%;
  line-height: 1.6;
  color: #333;
}

.message-text p {
  margin: 0;
  padding: 0;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

.answer-main {
  margin-left: 16px;
  width: 100%;
  line-height: 1.6;
  color: #333;
}

.typing-indicator {
  display: flex;
  padding: 12px 24px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f7ff 100%);
  border-radius: 12px;
  margin: 16px 0;
  max-width: 85%;
}

.conversation-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.conversation-loading .typing-indicator {
  margin: 0 auto;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  background-color: #4a5ed0;
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  animation: bounce 1.5s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-5px);
  }
}


.divider {
  width: 100%;
  margin: 0 0;
}

.divider-collapse {
  width: 96%;
  margin: 0 1px;
}

.conversation-list {
  height: calc(100vh - 360px);
  overflow-y: auto;
  padding: 0 10px;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f5f5f5;
}

/* 自定义滚动条样式 */
.conversation-list::-webkit-scrollbar {
  width: 6px;
}

.conversation-list::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.conversation-list::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 3px;
}

.conversation-list-container {
  height: calc(100vh - 360px);
  overflow-y: auto;
  padding: 0 10px;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f5f5f5;
}

.conversation-list-container::-webkit-scrollbar {
  width: 6px;
}

.conversation-list-container::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.conversation-list-container::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 3px;
}

.conversation-item {
  height: 72px;
  margin: 4px 8px;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}

.conversation-avatar {
  background-color: #e6f7ff;
  color: #1890ff;
  margin-right: 12px;
}

.conversation-content {
  flex: 1;
  overflow: hidden;
}

.conversation-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-preview {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-item:hover {
  background-color: #f5f5f5;
}

.conversation-item.active {
  background-color: #f0f7ff;
}

.conversation-item.active .conversation-title {
  color: #1890ff;
  font-weight: 500;
}

.error-tip {
  padding: 10px;
  text-align: center;
}

.error-tip a {
  color: #1890ff;
  text-decoration: none;
}

.error-tip a:hover {
  text-decoration: underline;
}

.delete-button {
  display: none;
  padding: 0 5px;
  margin-left: 5px;
  color: #c0c4cc;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.history-line:hover .delete-button {
  display: inline-block;
}

.delete-button:hover {
  color: #f56c6c;
  transform: scale(1.1);
}

.delete-button:active {
  color: #f78989;
  transform: scale(0.95);
}

.delete-button, .batch-action-button {
  transition: all 0.2s;
}

.delete-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: none;
  padding: 4px;
  color: #000000;
  transition: all 0.3s;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  z-index: 1;
}

.delete-button:hover {
  color: #f56c6c;
  transform: translateY(-50%) scale(1.1);
}

.batch-actions {
  padding: 0 10px;
}

.batch-action-container {
  display: flex;
  gap: 8px;
  margin: 16px 0;
  padding: 0 10px;
}

.batch-action-button {
  flex: 1;
  background: linear-gradient(135deg, #4a5ed0 0%, #5585d7 50%, #4a5ed0 100%);
  background-size: 200% 100%;
  color: white;
  border: none;
}

.batch-action-button:hover {
  background-position: 100% 0;
  color: white;
}

.batch-action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.batch-action-button:active {
  transform: translateY(0);
}

.conversation-item {
  position: relative;
}

.conversation-item:hover .delete-button {
  display: block;
}
</style>