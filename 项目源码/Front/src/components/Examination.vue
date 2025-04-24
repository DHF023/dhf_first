<template>
  <div class="examination">
    <div class="main">
      <div class="toolbar">
        <!-- 教师或管理员角色可见的新建考试按钮 -->
        <el-button class="new-examination-btn" round @click="openNewExaminationPage" v-if="user.role === '教师' || user.role === 'ROLE_ADMIN'">
          <span class="new-examination-text">新建考试</span>
        </el-button>

        <!-- 考试库按钮，用于切换考试列表的显示状态 -->
        <el-button class="examination-repository-btn" round @click="toggleExaminationList">
          <span class="examination-repository-text">考试库</span>
        </el-button>
      </div>
      <el-divider class="divider"></el-divider>

      <!-- 考试列表渲染区域，根据showExaminationList状态显示或隐藏 -->
      <div style="display: flex; justify-content: center;">
        <div class="examination-list" v-if="showExaminationList">
          <el-table :data="examinationList" style="width: 100%" border height="400">
            <el-table-column prop="title" label="考试标题" width="180"></el-table-column>
            <el-table-column prop="description" label="考试描述"></el-table-column>
            <el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}, // 当前用户信息，从localStorage获取
      showExaminationList: false, // 控制考试列表显示状态的布尔值
      examinationList: [] // 存储考试列表数据的数组
    };
  },
  methods: {
    openNewExaminationPage() {
      // 在新标签页打开新建考试页面
      window.open(this.$router.resolve({ name: 'NewExaminationPage' }).href, '_blank');
    },
    toggleExaminationList() {
      // 切换考试列表的显示状态
      this.showExaminationList = !this.showExaminationList;
    }
  }
};
</script>

<style scoped>
.examination {
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

.new-examination-btn {
  background-color: #829aff;
  border: #829aff 1px solid;
  margin-left: 30px;
  width: 104px;
  height: 36px;
}
.new-examination-btn:hover {
  background-color: #6b85e9;
}
.new-examination-btn:focus {
  background-color: #6b85e9;
}

.new-examination-text {
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

.examination-repository-btn {
  border: #829aff 1px solid;
  width: 90px;
  height: 36px;
  margin-left: 30px;
}

.examination-repository-text {
  font-size: 14px;
  color: #829aff;
}

.examination-list {
  width: 90%;
  padding-top: 20px;
}
</style>