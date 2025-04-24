<template>
  <div class="competition">
    <div class="main">
      <div class="header">
        <span style="line-height: 60px; font-size: 24px; font-weight: bold;">{{ competition.contest_title }}</span>
      </div>
      <div style="display: flex; justify-content: center;">
        <!-- 导航按钮，用于切换不同视图 -->
        <el-button type="text" @click="navigateTo('List')" :class="{ 'text-button': true, 'active-button': isListActive }">
          <span style="color: #000000; font-size: 14px;">题目列表</span>
        </el-button>
        <el-button type="text" @click="navigateTo('Record')" :class="{ 'text-button': true, 'active-button': isRecordActive }">
          <span style="color: #000000; font-size: 14px;">所有提交</span>
        </el-button>
        <el-button type="text" @click="navigateTo('Rank')" :class="{ 'text-button': true, 'active-button': isRankActive }">
          <span style="color: #000000; font-size: 14px;">榜单</span>
        </el-button>
      </div>
      <!-- 路由视图，用于渲染不同子组件 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import newRequest from '@/utils/newRequest';

export default {
  name: 'Competition',
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}, // 当前用户信息
      id: this.$route.params.id, // 当前比赛ID
      competition: {
        contest_title: '', // 比赛标题
        holder_id: '', // 举办者ID
        holder_name: '', // 举办者名称
        start_time: '', // 比赛开始时间
        end_time: '', // 比赛结束时间
      },
      loading: true, // 加载状态
      error: null // 错误信息
    };
  },
  computed: {
    currentRouteName() {
      return this.$route.name; // 获取当前路由的名称
    },
    isListActive() {
      return this.currentRouteName === 'List'; // 判断是否为题目列表视图
    },
    isRecordActive() {
      return this.currentRouteName === 'Record'; // 判断是否为所有提交视图
    },
    isRankActive() {
      return this.currentRouteName === 'Rank'; // 判断是否为榜单视图
    },
  },
  methods: {
    navigateTo(routeName) {
      // 导航到指定路由
      this.$router.push({ name: routeName, params: { id: this.id } });
    },
    fetchContestInfo() {
      // 获取比赛信息
      console.log('用户token', this.user.token);
      newRequest.get(`/api/contest/getinfo/${this.id}`)
        .then(response => {
          this.competition = response;
          this.loading = false;
          console.log('Contest Info:', this.competition);
        })
        .catch(error => {
          this.error = error;
          this.loading = false;
          console.error('Failed to fetch contest info:', error);
        });
    }
  },
  watch: {
    // 监听路由变化，更新比赛ID并重新获取比赛信息
    '$route'(to) {
      this.id = to.params.id;
      this.fetchContestInfo();
    }
  },
  mounted() {
    // 组件挂载时获取比赛信息
    this.fetchContestInfo();
  }
};
</script>

<style scoped>
.competition {
  overflow: auto;
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
}

.main {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  width: 65%;
}

.header {
  display: flex;
  justify-content: center;
  height: 60px;
}

.text-button:hover {
  font-weight: bold;
}

.active-button span {
  font-weight: bold;
}
</style>