<template>
  <!-- 作业组件的模板部分 -->
  <div class="homework">
    <div class="main">
      <div class="toolbar">
        <el-button class="new-homework-btn" round @click="openNewHomeworkPage" v-if="user.role === '教师' || user.role === 'ROLE_ADMIN'">
          <span class="new-homework-text">新建作业</span>
        </el-button>

        <el-button class="homework-repository-btn" round @click="toggleHomeworkList">
          <span class="homework-repository-text">作业库</span>
        </el-button>
      </div>
      <el-divider class="divider"></el-divider>

      <div style="display: flex; justify-content: center;">
        <div class="homework-list" v-if="showHomeworkList">
          <el-table :data="homeworkList" style="width: 100%" border height="400">
            <el-table-column prop="title" label="作业标题" width="180"></el-table-column>
            <el-table-column prop="description" label="作业描述"></el-table-column>
            <el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 作业组件的脚本部分
export default {
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}, // 用户信息
      showHomeworkList: false, // 控制作业列表显示状态
      homeworkList: [] // 作业列表数据
    };
  },
  methods: {
    // 打开新建作业页面
    openNewHomeworkPage() {
      window.open(this.$router.resolve({ name: 'NewHomeworkPage' }).href, '_blank');
    },
    // 切换作业列表显示状态
    toggleHomeworkList() {
      this.showHomeworkList = !this.showHomeworkList;
    }
  }
};
</script>

<style scoped>
/* 作业组件的样式部分 */
.homework {
  min-height: calc(100vh - 60px);
  overflow: auto;
  padding: 20px 0 20px 0;
  display: flex;
  justify-content: center;
}

.main {
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  width: 65%;
  margin-bottom: 60px;
}

.new-homework-btn {
  background-color: #829aff;
  border: #829aff 1px solid;
  margin-left: 30px;
  width: 104px;
  height: 36px;
}
.new-homework-btn:hover {
  background-color: #6b85e9;
}
.new-homework-btn:focus {
  background-color: #6b85e9;
}

.new-homework-text {
  color: #f1f1f1;
  font-size: 14px;
}

.toolbar {
  height: 80px;
  display: flex;
  align-items: center;
}

.divider {
  width: 100%;
  margin: 0 0;
}

.homework-repository-btn {
  border: #829aff 1px solid;
  width: 90px;
  height: 36px;
  margin-left: 30px;
}

.homework-repository-text {
  font-size: 14px;
  color: #829aff;
}

.homework-list {
  width: 90%;
  padding-top: 20px;
}
</style>