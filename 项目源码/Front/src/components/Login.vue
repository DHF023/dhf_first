<template>
  <div>
    <div style="width: 400px; height: 350px; margin: 150px auto; background-color:rgba(85,133,215,0.5); border-radius: 10px">
      <div style="width: 100%; height: 100px; font-size: 30px; line-height: 100px; text-align: center; color: #4a5ed0">欢 迎 登 录</div>
      <div style="margin-top: 25px; text-align: center; height: 320px;">
        <el-form :model="admin">
          <el-form-item>
            <el-input v-model="admin.name" prefix-icon="el-icon-user" style="width: 80%" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="admin.password" show-password prefix-icon="el-icon-lock" style="width: 80%" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 80%; margin-top: 10px" type="primary" @click="login()">登 录</el-button>
          </el-form-item>
          <el-form-item>
              <div style="text-align: center">
                <a href="javascript:void(0)" style="text-decoration: none" @click="navRegister()">点击注册</a>
                <el-divider direction="vertical"></el-divider>
                <a href="javascript:void(0)" style="text-decoration: none" @click="navPassword()">忘记密码</a>
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
    }
  },
  // 页面加载的时候，做一些事情，在created里面
  created() {
  },
  // 定义一些页面上控件出发的事件调用的方法
  methods: {
    login() {
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
      })
    },
    navRegister() {
      this.$router.push("/register");
    },
    navPassword() {

    },
  }
}
</script>