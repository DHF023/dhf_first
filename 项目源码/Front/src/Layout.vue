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
            <el-submenu index="/analysis">
              <template slot="title">
                <span>综合分析</span>
              </template>
              <el-menu-item index="/homework-analysis">
                <span>作业完成度</span>
              </el-menu-item>
              <el-menu-item index="/exam-analysis">
                <span>考试分析</span>
              </el-menu-item>
              <el-menu-item index="/practice-analysis">
                <span>题库练习情况</span>
              </el-menu-item>
            </el-submenu>
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

        <!-- 全局搜索框和头像/登录注册按钮容器 -->
        <div class="header-right">
          <!-- 全局搜索框 -->
          <div class="search-box" :class="{ 'search-box-expanded': isSearching }">
            <i class="el-icon-search search-icon" @click="toggleSearchByIcon"></i>
            <el-input
                v-show="isSearching"
                placeholder="请输入搜索内容"
                v-model="searchQuery"
                clearable
                @keyup.enter.native="handleSearch"
                ref="searchBox"
                style="padding-left: 30px;"
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
      isSearching: false, // 控制搜索框的显示状态
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
    // 切换搜索状态（仅通过放大镜图标触发）
    toggleSearchByIcon() {
      if (this.isSearching) {
        this.isSearching = false; // 如果搜索框已展开，则点击图标后收缩
      } else {
        this.isSearching = true; // 如果搜索框未展开，则点击图标后展开
        // 自动聚焦到输入框（可选）
        if (this.$refs.searchBox) {
          this.$nextTick(() => this.$refs.searchBox.focus());
        }
      }
    },
    // 处理搜索
    handleSearch() {
      if (this.searchQuery.trim() !== '') {
        this.$router.push({ path: '/search', query: { q: this.searchQuery } });
      } else {
        this.$message('请输入搜索内容');
      }
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
  z-index: 1000;
  top: 0;
  right: 0;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px 0 100px;
}

.main {
  background-color: #f1f1f1;
  margin-top: 60px;
  overflow: auto;
  max-height: calc(100vh - 60px);
  padding: 0;
}

.router {
  flex-basis: 55%;
  flex-grow: 1;
}

.other {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.search-box {
  position: relative;
  width: 40px;
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
}

.search-box-expanded {
  width: 400px;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
}

.search-box /deep/ .el-input__inner {
  border: none;
  padding-left: 20px;
  margin-right: 30px;
}

.search-box /deep/ .el-input__inner:focus {
  border: none;
  outline: none;
}

.search-box /deep/ .el-input {
  width: 97%;
  box-sizing: border-box;
  transition: width 0.3s ease;
}

.search-box .el-input input {
  padding-left: 30px;
  box-sizing: border-box;
}

.search-icon {
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  left: 10px;
  transition: left 0.3s ease;
  z-index: 1;
}

.search-box-expanded .search-icon {
  left: 10px;
}

.search-box.active {
  width: 400px;
}

.text-in-button {
  font-size: 14px;
  color: #4a5ed0;
}

/* 新增的导航栏悬浮效果 */
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal .el-submenu__title:hover {
  background-color: #f0f7ff;
  color: #409EFF;
}

/* 修改下拉菜单宽度 */
.el-menu--horizontal .el-submenu .el-menu {
  min-width: 180px !important;
}

/* 隐藏下拉菜单箭头 */
.el-menu--horizontal .el-submenu .el-submenu__icon-arrow {
  display: none !important;
}

.el-menu--horizontal .el-menu-item.is-active {
  color: #409EFF !important;
  font-weight: bold;
  border-bottom: none;
}

.el-menu-item:hover {
  background-color: #f0f7ff !important;
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
