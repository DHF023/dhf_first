<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-title">欢 迎 注 册</div>
      <div class="register-form-container">
        <el-form :model="admin">
          <el-form-item>
            <el-input v-model="admin.name" prefix-icon="el-icon-user" class="input-field" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="admin.password" prefix-icon="el-icon-lock" class="input-field" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="admin.role" placeholder="请选择" class="select-field">
              <el-option label="教 师" value="教师"></el-option>
              <el-option label="学 生" value="学生"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="register-button" type="primary" @click="register()">注册</el-button>
          </el-form-item>
          <el-form-item>
            <div class="login-link-container">
              已有账号？<a href="javascript:void(0)" class="login-link" @click="navLogin()">前往登录</a>
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
  name: "Register",
  data() {
    return {
      admin: {},
    };
  },
  methods: {
    register() {
      request.post("/admin/register", this.admin).then(res => {
        if (res.code === '0') {
          this.$message({
            message: '注册成功',
            type: 'success'
          });
          this.$router.push("/login");
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      });
    },
    navLogin() {
      this.$router.push("/login");
    },
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.register-box {
  width: 400px;
  height: 400px;
  margin: auto;
  background-color: rgba(73, 134, 231, 0.5);
  border-radius: 10px;
  padding: 20px;
}

.register-title {
  width: 100%;
  height: 100px;
  font-size: 30px;
  line-height: 100px;
  text-align: center;
  color: #3a49a8;
}

.register-form-container {
  margin-top: 25px;
  text-align: center;
  height: 270px; /* Adjusted to fit the content */
}

.input-field,
.select-field {
  width: 80%;
}

.register-button {
  width: 80%;
  margin-top: 10px;
}

.login-link-container {
  text-align: center;
}

.login-link {
  text-decoration: none;
  color: #3a49a8;
}
</style>