<template>
  <div class="examination">
    <div class="main">
      <div class="toolbar">
        <el-button class="new-examination-btn" round @click="dialogVisible = true">
          <span class="new-examination-text">新建考试</span>
        </el-button>

        <el-button class="examination-repository-btn" round @click="">
          <span class="examination-repository-text">试卷库</span>
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
              <el-radio label="手动创建考试" style="display: block; margin-bottom: 50px; color: black;" class="el-radio-text1"></el-radio>
              <el-radio label="自动随机组卷" style="display: block; color: black;" class="el-radio-text2"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="dialogVisible = false" round>取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false" round>下一步</el-button>
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
  }
}
</script>

<style scoped>
.examination {
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


.new-examination-btn {
  background-color: #829aff;
  border: #829aff 1px solid;
  margin-left: 30px;
  margin-right: 20px;
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


.el-radio-text1::after {
  content: '（手动编辑创建新试卷）';
  display: block;
  margin: 10px 24px;
  font-size: 12px;
  font-weight: lighter;
}
.el-radio-text2::after {
  content: '（系统从已有题库中随机选题组卷）';
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

.examination-repository-btn {
  border: #829aff 1px solid;
  width: 90px;
  height: 36px;
}

.examination-repository-text {
  font-size: 14px;
  color: #829aff;
}
</style>