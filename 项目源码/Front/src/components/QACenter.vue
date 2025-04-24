<template>
  <div class="center">
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

          <div class="add-collapse">
            <el-button type="primary" class="add-button-collapse" @click="createNewConversation">
              <img :src="addSvg" alt="Add"/>
            </el-button>
          </div>
        </div>

        <!--边栏打开状态-->
        <div v-if="isSidebarCollapsed === false">
          <div style="width: 100%; height: 30px;">
            <el-button class="toggle-button" @click="toggleSidebar" plain>
              <i class="el-icon-arrow-left" style="color: #4c4c4c;"></i>
            </el-button>
          </div>

          <el-divider class="divider"></el-divider>

          <div class="add-open">
            <el-button type="primary" class="add-button-open" @click="createNewConversation">
              <div style="display: flex; justify-content: center; align-items: center;">
                <img :src="addSvg" alt="Add"/><span style="font-size: 18px; margin-left: 3px;">新对话</span>
              </div>
            </el-button>
          </div>

          <el-divider class="divider"></el-divider>

          <div class="search-open">
            <el-input class="search-input" placeholder="搜索历史记录" v-model="history">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>

          <div class="history">
            <div v-for="(line, index) in historyLines" :key="index" class="history-line" @click="loadMessages(index)">
              <div style="width: 180px; overflow: hidden;">
                <span class="line-span">{{ line }}</span>
              </div>
              <div class="done-button">
                <el-button @click="updateLine" class="edit-button">
                  <img :src="editSvg" alt="Edit"/>
                </el-button>
                <el-button @click="deleteLine" class="edit-button">
                  <img :src="deleteSvg" alt="Delete"/>
                </el-button>
              </div>
            </div>
          </div>

          <el-divider class="divider"></el-divider>
        </div>
      </div>
    </div>

    <div class="right-part" :class="{ expanded: !isSidebarCollapsed, collapsed: isSidebarCollapsed }">
      <div style="width: 800px;">
        <div v-if="isNewDialog === false">
          <div class="answer-part">
            <div class="answer-container">
              <div v-for="(msg, index) in messages" :key="index">
                <div v-if="msg.from === 'user'" class="message-container-user">
                  <el-avatar :src="'http://localhost:8080/api/files/' + avatarUrl" :size="40"></el-avatar>
                  <div class="message-text">
                    <p v-html="msg.content"></p>
                  </div>
                </div>
                <div v-else-if="msg.from === 'ai'" class="message-container-ai">
                  <el-avatar :size="40">AI</el-avatar>
                  <div class="answer-main">
                    <p v-html="msg.content"></p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="ask-part">
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
/*import newQARequest from '@/utils/newQARequest';*/
import goodSvg1 from '@/assets/appreciate_light.svg';
import goodSvg2 from '@/assets/appreciate_fill_light.svg';
import { addHistory, updateHistory, deleteHistory } from '@/data/history.js';
import editSvg from '@/assets/创作.svg';
import deleteSvg from '@/assets/删除.svg';
import addSvg from '@/assets/electronics.svg';
import badSvg1 from '@/assets/oppose_light.svg';
import badSvg2 from '@/assets/oppose_fill_light.svg';

export default {
  name: 'qa-center',
  data() {
    return {
      textarea: '',
      history: '',
      message: '',
      AImessage: '稍等一会，AI正在思考……',
      formattedMessage: '',// 用于存储已经转换为<br>标签的消息
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      isLiked: false,  // 是否点赞
      isDisliked: false, // 是否点踩
      goodSvg1,
      goodSvg2,
      isSidebarCollapsed: false,
      conversationIds: [],
      historyLines: [],
      messages: [],
      editSvg,
      deleteSvg,
      addSvg,
      isNewDialog: false,
      badSvg1,
      badSvg2,
    }
  },
  mounted() {
    const userId = this.user.id;
    this.loadConversations();
    newQARequest.get(`/conversations`, {
      params: { user_id: userId }
    }).then(res => {
      this.historyLines = res.data.map(c => `对话 ${c.id}`);
      this.conversationIds = res.data.map(c => c.id);  // 存 conversation_id
    });
  },

  watch: {
    // 监听inputText的变化，实时更新formattedMessage
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
    // 加载用户的所有对话
    loadConversations() {
      const userId = this.user.id;
      newQARequest.get(`/conversations`, {
        params: { user_id: userId }
      }).then(res => {
        this.historyLines = res.data.map(c => `对话 ${c.id}`);
        this.conversationIds = res.data.map(c => c.id);  // 存储 conversation_id
      });
    },

    // 创建新对话
    createNewConversation() {
      const userId = this.user.id;
      newQARequest.post(`/conversations`, { user_id: userId })
          .then(res => {
            const newConversationId = res.data.conversation_id;
            this.historyLines.push(`对话 ${newConversationId}`);
            this.conversationIds.push(newConversationId);
            this.loadMessages(this.historyLines.length - 1); // 加载新创建的对话的消息
          }).catch(err => {
        console.error("创建新对话失败：", err);
      });
    },
    loadMessages(index) {
      const conversationId = this.conversationIds[index];  // 获取对应对话ID
      newQARequest.get(`/messages`, {
        params: { conversation_id: conversationId }
      }).then(res => {
        const messages = res.data;
        console.log(messages); // 打印消息，确认是否有数据

        // 检查返回的数据格式
        if (messages && Array.isArray(messages)) {
          this.messages = messages; // 将消息数据绑定到 Vue 数据中
        } else {
          console.error("返回数据格式错误:", messages);
        }
      }).catch(err => {
        console.error("加载消息失败：", err);
      });
    },
    promote() {
      const userId = this.user.id;
      const question = this.textarea;
      const conversationId = this.currentConversationId;

      // 把用户提问加入 messages 列表
      this.messages.push({ from: 'user', content: this.formattedMessage });

      newQARequest.post("/ask", {
        user_id: userId,
        question: question,
        conversation_id: conversationId
      }).then(res => {
        const aiAnswer = res.data.answer;
        this.messages.push({ from: 'ai', content: aiAnswer }); // 添加 AI 回复
      });

      this.textarea = "";
    },
    handleKeyup(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        // 普通 Enter 键被按下，发送消息
        this.promote();
      } else if (event.key === 'Enter' && event.shiftKey) {
      }
    },
    convertNewlinesToBr(text) {
      // 将换行符转换为<br>标签
      return text.replace(/\r?\n/g, '<br>');
    },
    toggleLike() {
      this.isLiked = !this.isLiked;
      this.isDisliked = false; // 如果点赞了，则取消点踩状态
    },
    toggleDisLike() {
      this.isDisliked = !this.isDisliked;
      this.isLiked = false; // 如果点踩了，则取消点赞状态
    },
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    addNewLine() {
      addHistory(this.newText);
      this.historyLines = getHistory();
      this.newText = '';
    },
    updateLine(index, text) {
      updateHistory(index, text);
      this.historyLines = getHistory();
    },
    deleteLine(index) {
      deleteHistory(index);
      this.historyLines = getHistory();
    }
  }
};
</script>

<style scoped>
.center {
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
}

.left-part.collapsed {
  width: 50px;
}

.right-part {
  position: relative;
  display: flex;
  justify-content: center; /* 水平居中 */
  height: calc(100vh - 60px);
  margin-top: 20px;
  transition: flex-basis 0.3s ease;
}
.right-part.expanded {
  flex-basis: calc(100% - 250px); /* 展开时右侧区域的宽度 */
}
.right-part.collapsed {
  flex-basis: calc(100% - 50px); /* 收起时右侧区域的宽度 */
}

.answer-part {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  width: 100%;
  height: 480px;
  margin-bottom: 15px;
  overflow: auto;
}

.ask-part {
  position: relative;
  width: 100%;
  height: 115px;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

.answer-container {
  width: 96%;
  height: 450px;
  margin-left: 20px;
  margin-top: 20px;

}

.toggle-button {
  position: relative;
  border: none;
  width: 50px;
  height: 30px;
  float: right;
}

textarea {
  resize: none;
  overflow: hidden;
  font-size: 16px;
  border: none;
  outline: none;
  margin-top: 8px;
}

.textarea-part {
  margin-left: 15px;
}

.add-open {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
}

.add-collapse {
  width: 100%;
  height: 100px;
}

.add-button-open {
  position: relative;
  border-radius: 25px;
  width: 230px;
  height: 50px;
  margin-top: 25px;
}

.add-button-collapse {
  position: relative;
  width: 100%;
  height: 50px;
  margin-top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-open {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.search-input {
  width: 95%;
}

.promotion-button {
  position: absolute;
  width: 70px;
  height: 40px;
  bottom: 10px;
  right: 30px;
}

.promotion-icon {
  font-size: 20px;
}

.message-container-user {
  display: flex;
  margin-bottom: 10px;
  font-size: 16px;
}

.message-container-ai {
  display: flex;
  margin-bottom: 10px;
  font-size: 16px;
}

.message-text {
  margin-left: 15px;
  width: 700px;
}

.answer-main {
  background-color: #f1f1f1;
  margin-left: 15px;
  width: 680px;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
}

.thumbs-component {
  display: flex;
  position: relative;
  width: 150px;
  height: 20px;
  left: 600px;
}

.thumb {
  cursor: pointer;
  transition: color 0.3s;
  width: 25px;
}

.divider {
  width: 96%;
  margin: 0 5px;
}

.divider-collapse {
  width: 96%;
  margin: 0 1px;
}

.history {
  height: 400px;
  overflow: auto;
}

.history-line {
  height: 40px;
  background-color: #ffffff;
  margin-bottom: 2px;
  border-radius: 10px;
  display: flex;
  align-items: center;
}
.history-line:hover {
  background-color: #e8e8e8;
}

.line-span {
  font-size: 13px;
  height: 30px;
  line-height: 30px;
  margin-left: 15px;
  white-space: nowrap; /* 禁止文本换行 */
}

.done-button {
  display: flex;
  width: 40px;
}

.edit-button {
  border: none;
  background-color: #e8e8e8;
  display: none;
  padding: 0;
}
.edit-button:hover {
  background-color: #d2d2d2;
}
.edit-button:active {
  background-color: #e8e8e8;
}

.history-line:hover .edit-button {
  display: block;
}
</style>