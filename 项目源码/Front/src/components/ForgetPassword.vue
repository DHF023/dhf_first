<template>
  <div>
    <!-- 忘记密码框的容器 -->
    <div class="forget-password-container">
      <!-- 忘记密码框的标题 -->
      <div class="forget-password-title">忘 记 密 码</div>
      <!-- 忘记密码表单的容器 -->
      <div class="forget-password-form-container">
        <!-- 忘记密码表单 -->
        <el-form :model="forgetPasswordForm">
          <!-- 邮箱/用户名输入框 -->
          <el-form-item>
            <el-input v-model="forgetPasswordForm.identifier" prefix-icon="el-icon-user" class="input-field" placeholder="请输入邮箱/用户名"></el-input>
          </el-form-item>
          <!-- 验证码输入框 -->
          <el-form-item class="verification-code-item">
            <div style="display: flex; justify-content: space-between">
              <el-input v-model="forgetPasswordForm.verificationCode" prefix-icon="el-icon-key" class="input-field" placeholder="请输入验证码"></el-input>
              <el-button type="text" @click="sendVerificationCode" style="">发送验证码</el-button>
            </div>
          </el-form-item>
          <!-- 新密码输入框 -->
          <el-form-item>
            <el-input v-model="forgetPasswordForm.newPassword" show-password prefix-icon="el-icon-lock" class="input-field" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <!-- 确认新密码输入框 -->
          <el-form-item>
            <el-input v-model="forgetPasswordForm.confirmPassword" show-password prefix-icon="el-icon-lock" class="input-field" placeholder="请确认新密码"></el-input>
          </el-form-item>
          <!-- 提交按钮 -->
          <el-form-item>
            <el-button class="submit-button" type="primary" @click="resetPassword()">提 交</el-button>
          </el-form-item>
          <!-- 返回登录链接 -->
          <el-form-item>
            <div class="return-login-link">
              <a href="javascript:void(0)" @click="navLogin()">返回登录</a>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "ForgetPassword",
  data() {
    return {
      forgetPasswordForm: {
        identifier: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: ''
      }
    };
  },
  methods: {
    // 发送验证码到邮箱
    sendVerificationCode() {
      request.post("/admin/sendVerificationCode", { email: this.forgetPasswordForm.identifier })
          .then(response => {
            if (response.data.code === 0) { // 假设成功时code为0
              this.$message({
                message: '验证码已发送，请注意查收',
                type: 'info'
              });
            } else {
              this.$message({
                message: response.data.message, // 显示后端返回的错误信息
                type: 'error'
              });
            }
          })
          .catch(error => {
            this.$message({
              message: '发送验证码失败，请稍后重试',
              type: 'error'
            });
          });
    },
    // 重置密码
    resetPassword() {
      if (this.forgetPasswordForm.newPassword !== this.forgetPasswordForm.confirmPassword) {
        this.$message({
          message: '两次输入的密码不一致',
          type: 'error'
        });
        return;
      }

      request.post("/admin/resetPassword", {
        email: this.forgetPasswordForm.identifier,
        newPassword: this.forgetPasswordForm.newPassword
      })
          .then(response => {
            if (response.data.code === 0) { // 假设成功时code为0
              this.$message({
                message: '密码重置成功，请登录',
                type: 'success'
              });
              this.$router.push("/login");
            } else {
              this.$message({
                message: response.data.message, // 显示后端返回的错误信息
                type: 'error'
              });
            }
          })
          .catch(error => {
            this.$message({
              message: '密码重置失败，请稍后重试',
              type: 'error'
            });
          });
    },
    // 导航到登录页面
    navLogin() {
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.forget-password-container {
  width: 400px;
  height: 430px;
  margin: 120px auto;
  background-color: rgba(85, 133, 215, 0.5);
  border-radius: 10px;
}

.forget-password-title {
  width: 100%;
  height: 100px;
  font-size: 30px;
  line-height: 100px;
  text-align: center;
  color: #4a5ed0;
}

.forget-password-form-container {
  margin-top: 25px;
  height: 320px;
  margin-left: 40px;
  margin-right: 40px;
}

.verification-code-item .input-field {
  width: 70%; /* 验证码输入框宽度调整 */
}

.submit-button {
  width: 100%;
  margin-top: 10px;
}

.return-login-link {
  text-align: center;
}

.return-login-link a {
  text-decoration: none;
  color: #4a5ed0; /* 可选，设置链接颜色 */
}
</style>