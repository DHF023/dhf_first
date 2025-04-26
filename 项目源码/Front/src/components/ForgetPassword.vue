<template>
  <BackgroundContainer>
    <!-- 忘记密码功能的主容器 -->
    <div class="auth-container">
      <!-- 页面标题 -->
      <div class="auth-title">忘 记 密 码</div>
      <!-- 表单容器 -->
      <div class="auth-form-container">
        <!-- 忘记密码表单 -->
        <el-form :model="forgetPasswordForm">
          <!-- 输入邮箱/用户名的表单项 -->
          <el-form-item>
            <el-input v-model="forgetPasswordForm.identifier" prefix-icon="el-icon-user" class="input-field" placeholder="请输入邮箱/用户名"></el-input>
          </el-form-item>
          <!-- 输入验证码的表单项，包含发送验证码按钮 -->
          <el-form-item class="verification-code-item">
            <div style="display: flex; justify-content: space-between">
              <el-input v-model="forgetPasswordForm.verificationCode" prefix-icon="el-icon-key" class="input-field" placeholder="请输入验证码"></el-input>
              <el-button type="text" @click="sendVerificationCode">发送验证码</el-button>
            </div>
          </el-form-item>
          <!-- 输入新密码的表单项 -->
          <el-form-item>
            <el-input v-model="forgetPasswordForm.newPassword" show-password prefix-icon="el-icon-lock" class="input-field" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <!-- 确认新密码的表单项 -->
          <el-form-item>
            <el-input v-model="forgetPasswordForm.confirmPassword" show-password prefix-icon="el-icon-lock" class="input-field" placeholder="请确认新密码"></el-input>
          </el-form-item>
          <!-- 提交表单的按钮 -->
          <el-form-item>
            <el-button class="submit-button" type="primary" @click="resetPassword">提 交</el-button>
          </el-form-item>
          <!-- 返回登录页面的链接 -->
          <el-form-item>
            <div class="return-login-link">
              <a href="javascript:void(0)" @click="navLogin">返回登录</a>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </BackgroundContainer>
</template>

<script>
import request from "@/utils/request";
import BackgroundContainer from '@/components/common/BackgroundContainer.vue';

export default {
  components: {
    BackgroundContainer
  },
  name: "ForgetPassword",
  data() {
    return {
      forgetPasswordForm: {
        identifier: '', // 用户输入的邮箱或用户名
        verificationCode: '', // 用户输入的验证码
        newPassword: '', // 用户输入的新密码
        confirmPassword: '' // 用户确认的新密码
      }
    };
  },
  methods: {
    // 发送验证码到用户邮箱
    sendVerificationCode() {
      request.post("/admin/sendVerificationCode", { email: this.forgetPasswordForm.identifier })
          .then(response => {
            if (response.data.code === 0) { // 验证成功
              this.$message({
                message: '验证码已发送，请注意查收',
                type: 'info'
              });
            } else {
              this.$message({
                message: response.data.message, // 显示错误信息
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
    // 重置用户密码
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
            if (response.data.code === 0) { // 重置成功
              this.$message({
                message: '密码重置成功，请登录',
                type: 'success'
              });
              this.$router.push("/login");
            } else {
              this.$message({
                message: response.data.message, // 显示错误信息
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
.verification-code-item .input-field {
  width: 70%;
}

.submit-button {
  composes: auth-button;
  width: 100%;
}

.return-login-link {
  text-align: center;
}

.return-login-link a {
  composes: auth-link;
}
</style>