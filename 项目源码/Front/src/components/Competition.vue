<template>
  <div class="competition">
    <div class="main">
      <!-- 标题部分 -->
      <div class="header">
        <span style="line-height: 60px; font-size: 24px; font-weight: bold;">{{ competition.contest_title }}</span>
      </div>
      <!-- 按钮区域 -->
      <div style="display: flex; justify-content: center;">
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
      <!-- 路由视图，用于渲染子组件 -->
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
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      id: this.$route.params.id ? String(this.$route.params.id) : '',
      competition: {
        contest_title: '',
        holder_id: '',
        holder_name: '',
        start_time: '',
        end_time: '',
      },
      loading: true,
      error: null
    };
  },
  computed: {
    currentRouteName() {
      return this.$route.name; // 获取当前路由的名称
    },
    isListActive() {
      return this.currentRouteName === 'List';
    },
    isRecordActive() {
      return this.currentRouteName === 'Record';
    },
    isRankActive() {
      return this.currentRouteName === 'Rank';
    }
  },
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName, params: { id: this.id } });
    },
    fetchContestInfo() {
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
    // 监听路由变化，更新id并重新获取比赛信息
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