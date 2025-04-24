<template>
  <!-- 登录页面模板 -->
  <div class="login-container">
    <div class="login-box">
      <div class="login-title">欢 迎 登 录</div>
      <div class="login-form-container">
        <el-form :model="admin">
          <el-form-item>
            <el-input v-model="admin.name" prefix-icon="el-icon-user" class="input-field" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="admin.password" show-password prefix-icon="el-icon-lock" class="input-field" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login-button" type="primary" @click="login()">登 录</el-button>
          </el-form-item>
          <el-form-item>
            <div class="links-container">
              <a href="javascript:void(0)" class="link" @click="navRegister()">点击注册</a>
              <el-divider direction="vertical"></el-divider>
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

// 登录组件脚本
export default {
  name: "Login",
  data() {
    return {
      admin: {}, // 存储登录表单数据
    };
  },
  methods: {
    login() {
      // 发送登录请求并处理响应
      request.post("/admin/login", this.admin).then(res => {
        if (res.code === '0') {
          this.$message({
            message: '登录成功',
            type: 'success'
          });
          localStorage.setItem("user", JSON.stringify(res.data));
          this.$router.push("/");
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      });
    },
    navRegister() {
      // 导航到注册页面
      this.$router.push("/register");
    },
    navPassword() {
      // 导航到忘记密码页面
      this.$router.push("/forget-password");
    }
  }
};
</script>

<style scoped>
/* 登录页面样式 */
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