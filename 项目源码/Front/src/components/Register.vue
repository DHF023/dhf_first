<template>
  <div>
    <div style="width: 400px; height: 400px; margin: 150px auto; background-color:rgba(73,134,231,0.5); border-radius: 10px">
      <div style="width: 100%; height: 100px; font-size: 30px; line-height: 100px; text-align: center; color: #3a49a8">欢 迎 注 册</div>
      <div style="margin-top: 25px; text-align: center; height: 320px;">
        <el-form :model="admin">
          <el-form-item>
            <el-input v-model="admin.name" prefix-icon="el-icon-user" style="width: 80%" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="admin.password" prefix-icon="el-icon-lock" style="width: 80%" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="admin.role" placeholder="请选择" style="width: 80%" >
              <el-option label="教 师" value="教师"></el-option>
              <el-option label="学 生" value="学生"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 80%; margin-top: 10px;" type="primary" @click="register()">注册</el-button>
          </el-form-item>
          <el-form-item>
            <div style="text-align: center">
              已有账号？<a href="javascript:void(0)" style="text-decoration: none" @click="navLogin()">前往登录</a>
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
    }
  },
  // 页面加载的时候，做一些事情，在created里面
  created() {
  },
  // 定义一些页面上控件出发的事件调用的方法
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
      })
    },
    navLogin() {
      this.$router.push("/login");
    },
  }
}
</script>