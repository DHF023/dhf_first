<template>
  <div class="updatePassword">
    <!-- 容器布局 -->
    <el-container class="container">
      <!-- 头部，包含图标和标题 -->
      <el-header style="height: 50px; display: flex; align-items: center;">
        <img :src="updatePasswordSvg" alt="updatePassword"/>
        <span style="font-size: 18px; margin-left: 8px;">修 改 密 码</span>
      </el-header>
      <!-- 分隔线 -->
      <el-divider class="divider"></el-divider>
      <!-- 主要内容区域，包含表单 -->
      <el-main>
        <div style="margin-left: 30px; margin-top: 15px;">
          <!-- 表单，包含原密码、新密码和确认密码的输入项 -->
          <el-form label-width="100px" :model="form" :rules="rules" ref="ruleForm">
            <el-form-item label="原密码" prop="password">
              <el-input v-model="form.password" show-password prefix-icon="el-icon-lock" autocomplete="off" size="large" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="form.newPassword" show-password prefix-icon="el-icon-lock" autocomplete="off" size="large" style="width: 200px;" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="new2Password">
              <el-input v-model="form.new2Password" show-password prefix-icon="el-icon-lock" autocomplete="off" size="large" style="width: 200px;" placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
      <!-- 分隔线 -->
      <el-divider class="divider"></el-divider>
      <!-- 底部，包含保存按钮 -->
      <el-footer style="display: flex; justify-content: center; align-items: center; height: 100px;">
        <el-button class="save" type="primary" @click="save('ruleForm')">保 存</el-button>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import request from "@/utils/request"; // 导入请求工具
import updatePasswordSvg from "@/assets/money-credit-card.svg"; // 导入修改密码图标

export default {
  name: 'updatePassword', // 组件名称
  data() {
    // 密码验证函数
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.form.new2Password !== '') {
          this.$refs.ruleForm.validateField('new2Password');
        }
        callback();
      }
    };
    // 确认密码验证函数
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认密码'));
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}, // 当前用户信息
      form: {
        password: '', // 原密码
        newPassword: '', // 新密码
        new2Password: '', // 确认密码
      },
      updatePasswordSvg, // 修改密码图标
      rules: {
        newPassword: [
          {required: true, validator: validatePass, trigger: 'blur'} // 新密码验证规则
        ],
        new2Password: [
          {required: true, validator: validatePass2, trigger: 'blur'} // 确认密码验证规则
        ]
      }
    };
  },
  created() {
    // 组件创建时初始化原密码
    this.form.password = this.user.password;
  },
  methods: {
    // 保存方法
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 验证通过，更新用户密码并发送请求
          this.user.password = this.form.newPassword;
          request.post("/admin", this.user).then(res => {
            if (res.code === '0') {
              // 保存成功，显示成功消息并更新本地存储
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              localStorage.setItem("user", JSON.stringify(this.user));
            } else {
              // 保存失败，显示错误信息
              this.$message({
                message: res.msg,
                type: 'error'
              });
            };
          })
        }
      })
    },
  }
};
</script>

<style scoped>
.updatePassword {
  position: relative;
  min-height: calc(100vh - 60px);
  padding: 20px 0 20px 0;
  overflow: auto;
}

.container {
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  width: 60%;
  margin-left: 290px;
}

.save {
  width: 10%;
  font-size: 16px;
}

.divider {
  margin: 0 0;
}
</style>