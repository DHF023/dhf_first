<template>
  <div id="app">
    <el-container class="container">
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
            <el-menu-item index="/homework">
              <span slot="title">作业</span>
            </el-menu-item>
            <el-menu-item index="/examination">
              <span slot="title">考试</span>
            </el-menu-item>
            <!-- 仅当用户角色为管理员时显示用户管理菜单项 -->
            <el-menu-item index="/admin" v-if="user.role === 'ROLE_ADMIN'">
              <span slot="title">用户管理</span>
            </el-menu-item>
          </el-menu>
        </div>

        <!-- 全局搜索框 -->
        <div class="search-box">
          <el-input
              placeholder="请输入搜索内容"
              v-model="searchQuery"
              clearable
              @keyup.enter.native="handleSearch"
              prefix-icon="el-icon-search"
              style="width: 400px;"
          ></el-input>
        </div>


        <!-- 其他功能区域 -->
        <div class="other" v-if="isLoggedIn">
          <el-dropdown style="height: 60px; line-height: 60px;">
            <div>
              <el-avatar :src="'http://localhost:8080/api/files/' + avatarUrl" :size="46" style="margin-top: 7px;"></el-avatar>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="personal">个人中心</el-dropdown-item>
              <el-dropdown-item @click.native="updatePassword">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="other" v-else>
          <div>
            <el-button type="text" @click="signIn"><span class="text-in-button">登录</span></el-button>
            <el-button type="text" @click="signUp"><span class="text-in-button">注册</span></el-button>
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
export default {
  name: 'Layout',
  data () {
    return {
      // 用户信息，从localStorage中获取
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      searchQuery: '',
    }
  },
  computed: {
    isLoggedIn() {
      return this.user && this.user.id; // 假设用户对象在登录后会有id属性
    },
    // 头像URL
    avatarUrl() {
      return this.user && this.user.avatar ? this.user.avatar : 'default-avatar';
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
      if (this.$route.path !== '/personal-center') {
        this.$router.push('/personal-center');
      } else {
        this.$message('您已在个人中心页面');
      }
    },
    // 修改密码
    updatePassword() {
      if (this.$route.path !== '/update-password') {
        this.$router.push('/update-password');
      } else {
        this.$message('您已在修改密码页面');
      }
    },
    // 登录
    signIn() {
      this.$router.push("/login");
    },
    // 注册
    signUp() {
      this.$router.push("/register");
    },
    // 处理搜索
    handleSearch() {
      if (this.searchQuery.trim() !== '') {
        // 导航到搜索页面，并带上查询参数
        this.$router.push({ path: '/search', query: { q: this.searchQuery } });
      } else {
        // 如果搜索查询为空，给出提示
        this.$message('请输入搜索内容');
      }
    }
  },
};
</script>


<style scoped>
.container {
  height: 100%;
}

.header {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  display: flex; /* 使用Flexbox布局 */
  justify-content: space-between; /* 子元素在主轴上均匀分布 */
  align-items: center; /* 子元素在交叉轴上居中对齐 */
  padding: 0 30px; /* 为header添加内边距，确保内容不会紧贴边缘 */
}

.main {
  background-color: #f1f1f1;
  margin-top: 60px;
  overflow: auto;
  max-height: 100vh;
  padding: 0;
}

.router {
  margin-left: 100px;
}

.other {
  display: flex; /* 使内部元素也使用Flexbox布局 */
  align-items: center; /* 内部元素垂直居中 */
}


.search-box {
  width: 400px;
}

.text-in-button {
  font-size: 14px;
  color: #4a5ed0;
}
</style>
