<template>
  <div id="app">
    <el-container class="container">
      <!-- 头部容器 -->
      <el-header class="header" style="height: 60px; background-color: #ffffff;">
        <!-- 路由菜单 -->
        <div class="router">
          <el-menu
              :default-active="$route.path"
              router
              text-color="#000000"
              mode="horizontal">
            <el-menu-item index="/">
              <span slot="title">首页</span>
            </el-menu-item>
            <el-menu-item index="/problem-list">
              <span slot="title">题库</span>
            </el-menu-item>
            <el-menu-item index="/competition-list">
              <span slot="title">比赛</span>
            </el-menu-item>
            <el-menu-item index="/qa-center">
              <span slot="title">问答中心</span>
            </el-menu-item>
            <el-menu-item index="/progress-tracking">
              <span slot="title">进度追踪</span>
            </el-menu-item>
            <!-- 仅当用户角色为管理员时显示用户管理菜单项 -->
            <el-menu-item index="/admin" v-if="user.role === 'ROLE_ADMIN'">
              <span slot="title">用户管理</span>
            </el-menu-item>
          </el-menu>
        </div>


        <!-- 全局搜索框 -->
        <div class="global-search">
          <el-input v-model="globalSearch" placeholder="请输入内容" class="search" @click="">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>


        <!-- 其他功能区域 -->
        <div class="other">
          <!-- 消息和通知 -->
          <div class="message-and-notice">
            <el-dropdown>
              <img :src="messageSvg" alt="message"/>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>系统通知</el-dropdown-item>
                <el-dropdown-item>公告通知</el-dropdown-item>
                <el-dropdown-item>我的消息</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>


          <!-- 关于我 -->
          <div class="aboutMe">
            <el-dropdown style="float: right; height: 60px; line-height: 60px;">
              <div>
                <el-avatar :src="'http://localhost:8080/api/files/' + avatarUrl" :size="45"></el-avatar>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="personal">个人中心</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="updatePassword">修改密码</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="logout">退出登录</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>


      <!-- 主内容区域 -->
      <el-main class="main">
          <router-view/>
      </el-main>
    </el-container>
  </div>
</template>


<script>
import messageSvg from '@/assets/message.svg';
import noticeSvg from '@/assets/notification.svg';


export default {
  name: 'Layout',
  data () {
    return {
      // 用户信息，从localStorage中获取
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      messageSvg,
      noticeSvg,
      // 全局搜索内容
      globalSearch: '',
    }
  },
  computed: {
    // 头像URL
    avatarUrl() {
      return this.user.avatar;
    }
  },
  methods: {
    // 退出登录
    logout() {
      localStorage.removeItem("user");
      this.$router.push("/login");
    },
    // 进入个人中心
    personal() {
      this.$router.push("personal-center");
    },
    // 修改密码
    updatePassword() {
      this.$router.push("update-password");
    },
  },
};
</script>


<style scoped>
.container {
  height: 100%;
}


.header {
  position: fixed;
  z-index: 1000; /* 确保header在其他内容之上 */
  top: 0;
  right: 0;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}


.main {
  background-color: #f1f1f1;
  margin-top: 60px;
  overflow: auto;
  max-height: 100vh;
  padding: 0;
}


.router{
  width: 700px;
  height: 60px;
  margin-left: 100px;
}


.global-search {
  position: absolute;
  top: 15px;
  right: 400px;
  width: 400px;
  height: 60px;
}


.other {
  position: absolute;
  top: 0;
  right: 30px;
  width: 200px;
  height: 60px;
}


.message-and-notice {
  position: absolute;
  top: 20px;
  right: 60px;
}


.aboutMe {
  position: absolute;
  top: 7px;
  right: 0px;
}


.search {
  width: 400px;
  border: none;
}
</style>
