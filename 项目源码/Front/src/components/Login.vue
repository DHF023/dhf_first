<template>
  <div class="login-container">
    <!-- 登录框的容器 -->
    <div class="login-box">
      <!-- 登录框的标题 -->
      <div class="login-title">欢 迎 登 录</div>
      <!-- 登录表单的容器 -->
      <div class="login-form-container">
        <!-- 登录表单 -->
        <el-form :model="admin">
          <!-- 用户名输入框 -->
          <el-form-item>
            <el-input v-model="admin.name" prefix-icon="el-icon-user" class="input-field" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <!-- 密码输入框 -->
          <el-form-item>
            <el-input v-model="admin.password" show-password prefix-icon="el-icon-lock" class="input-field" placeholder="请输入密码"></el-input>
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item>
            <el-button class="login-button" type="primary" @click="login()">登 录</el-button>
          </el-form-item>
          <!-- 注册和忘记密码的链接 -->
          <el-form-item>
            <!-- 注册和忘记密码的链接容器 -->
            <div class="links-container">
              <!-- 注册链接 -->
              <a href="javascript:void(0)" class="link" @click="navRegister()">点击注册</a>
              <!-- 垂直分割线 -->
              <el-divider direction="vertical"></el-divider>
              <!-- 忘记密码链接 -->
              <a href="javascript:void(0)" class="link" @click="navPassword()">忘记密码</a>
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
  name: "Login",
  data() {
    return {
      admin: {},
    };
  },
  methods: {
    // 登录方法
    login() {
      // 发送登录请求
      request.post("/admin/login", this.admin).then(res => {
        if (res.code === '0') {
          // 登录成功提示
          this.$message({
            message: '登录成功',
            type: 'success'
          });
          // 存储用户信息到本地存储
          localStorage.setItem("user", JSON.stringify(res.data));
          // 跳转到首页
          this.$router.push("/");
        } else {
          // 登录失败提示
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      });
    },
    // 跳转到注册页面
    navRegister() {
      this.$router.push("/register");
    },
    // 忘记密码功能
    navPassword() {
      this.$router.push("/forget-password"); // 导航到忘记密码页面
    },
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-box {
  width: 400px;
  height: 350px;
  background-color: rgba(85, 133, 215, 0.5);
  border-radius: 10px;
  padding: 20px;
}

.login-title {
  width: 100%;
  height: 100px;
  font-size: 30px;
  line-height: 100px;
  text-align: center;
  color: #4a5ed0;
}

.login-form-container {
  margin-top: 25px;
  text-align: center;
}

.input-field {
  width: 80%;
}

.login-button {
  width: 80%;
  margin-top: 10px;
}

.links-container {
  text-align: center;
}

.link {
  text-decoration: none;
  color: #4a5ed0;
}
</style>