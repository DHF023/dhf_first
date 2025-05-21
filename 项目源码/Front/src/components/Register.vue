<template>
  <BackgroundContainer>
    <!-- 注册表单容器 -->
    <div class="auth-container">
      <!-- 注册标题 -->
      <div class="auth-title">欢 迎 注 册</div>
      <!-- 注册表单内容 -->
      <div class="auth-form-container">
        <el-form :model="user">
          <!-- 用户名输入 -->
          <el-form-item>
            <el-input v-model="user.name" prefix-icon="el-icon-user" class="input-field" placeholder="请输入用户名" style="width: 260px;"></el-input>
          </el-form-item>
          <!-- 密码输入 -->
          <el-form-item>
            <el-input v-model="user.password" prefix-icon="el-icon-lock" class="input-field" placeholder="请输入密码" style="width: 260px;"></el-input>
          </el-form-item>
          <!-- 角色选择 -->
          <el-form-item>
            <el-select v-model="user.role" placeholder="请选择" class="select-field" style="width: 260px;">
              <el-option label="教 师" value="教师"></el-option>
              <el-option label="学 生" value="学生"></el-option>
              <el-option label="管 理 员" value="ROLE_ADMIN"></el-option>
            </el-select>
          </el-form-item>
          <!-- 注册按钮 -->
          <el-form-item>
            <el-button
                class="register-button"
                style="
                background: linear-gradient(to right, #409EFF, #66b1ff);
                border: none;
                color: white;
                font-weight: bold;
              "
                @click="register()"
            >
              注 册
            </el-button>
          </el-form-item>
          <!-- 登录链接 -->
          <el-form-item>
            <div class="login-link-container">
              已有账号？<a href="javascript:void(0)"
                      style="color: #6a9eff; text-decoration: none;"
                      @click="navLogin()">前往登录</a>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </BackgroundContainer>
</template>

<script>
import request from "@/utils/request"; // 导入请求工具
import BackgroundContainer from '@/components/common/BackgroundContainer.vue';

export default {
  components: {
    BackgroundContainer
  },
  name: "Register", // 组件名称
  data() {
    return {
      user: {}, // 存储用户注册信息
    };
  },
  methods: {
    // 注册方法
    register() {
      request.post("/user/register", this.user).then(res => {
        if (res.code === '0') {
          // 注册成功，显示消息并跳转到登录页面
          this.$message({
            message: '注册成功',
            type: 'success'
          });
          this.$router.push("/login");
        } else {
          // 注册失败，显示错误信息
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      });
    },
    // 导航到登录页面
    navLogin() {
      this.$router.push("/login");
    },
  }
};
</script>

<style scoped>
.input-field,
.select-field {
  composes: auth-input;
}

.register-button {
  composes: auth-button;
}

.login-link-container {
  text-align: center;
}

.login-link {
  composes: auth-link;
}
</style>
