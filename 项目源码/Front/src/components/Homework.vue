<template>
  <div class="homework">
    <div class="main">
      <div class="toolbar">
        <el-button class="new-homework-btn" round @click="dialogVisible = true">
          <span class="new-homework-text">新建作业</span>
        </el-button>

        <el-button class="homework-repository-btn" round @click="">
          <span class="homework-repository-text">作业库</span>
        </el-button>
      </div>
      <el-divider class="divider"></el-divider>

      <el-dialog
        title="选择创建方式"
        :visible.sync="dialogVisible"
        width="30%">
        <el-form>
          <el-form-item>
            <el-radio-group v-model="isAuto">
              <el-radio label="手动创建作业" style="display: block; margin-bottom: 50px; color: black;" class="el-radio-text1"></el-radio>
              <el-radio label="自动随机出题" style="display: block; color: black;" class="el-radio-text2"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="dialogVisible = false" round>取 消</el-button>
          <el-button type="primary" @click="goToNewPage" round>下一步</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      isAuto: '',
    }
  },
  methods: {
    goToNewPage() {
      this.dialogVisible = false; // 关闭对话框
      window.open('localhost:8081/homework/new-homework-page', '_blank'); // 打开新的浏览器标签页
    },
  },
}
</script>

<style scoped>
.homework {
  min-height: calc(100vh - 60px);
  overflow: auto;
  margin-top: 20px;
  margin-bottom: 20px;
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
  margin-right: 20px;
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


.el-radio-text1::after {
  content: '（手动编辑创建新作业）';
  display: block;
  margin: 10px 24px;
  font-size: 12px;
  font-weight: lighter;
}
.el-radio-text2::after {
  content: '（系统从已有题库中随机选题）';
  display: block;
  margin: 10px 24px;
  font-size: 12px;
  font-weight: lighter;
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
}

.homework-repository-text {
  font-size: 14px;
  color: #829aff;
}
</style>