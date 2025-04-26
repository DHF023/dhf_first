<template>
  <BackgroundContainer>
    <div class="auth-container">
      <div class="auth-title">欢 迎 登 录</div>
      <div class="auth-form-container">
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
  </BackgroundContainer>
</template>

<script>
import request from "@/utils/request";
import BackgroundContainer from '@/components/common/BackgroundContainer.vue';

export default {
  name: "Login",
  components: {
    BackgroundContainer
  },
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
.input-field {
  composes: auth-input;
}

.login-button {
  composes: auth-button;
}

.links-container {
  text-align: center;
}

.link {
  composes: auth-link;
}
</style>