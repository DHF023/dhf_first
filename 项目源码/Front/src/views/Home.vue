<template>
  <div class="home">
    <!-- 顶部统计卡片 -->
    <div class="stats-row">
      <div class="stat-card" v-for="stat in stats" :key="stat.title">
        <div class="stat-icon" :style="{color: stat.color}">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-content" :class="{'checkin-layout': stat.title === '连续打卡'}">
          <div class="stat-left">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-title">{{ stat.title }}</div>
          </div>
          <div v-if="stat.title === '连续打卡'" class="stat-right">
            <el-button
              v-if="stat.canCheck"
              type="success"
              size="small"
              @click.stop="checkIn"
              class="checkin-button"
            >
              <i class="el-icon-check"></i> 立即打卡
            </el-button>
            <el-tag
              v-else
              type="success"
              size="small"
              class="checked-tag"
            >
              <i class="el-icon-success"></i> 今日已打卡
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <!-- 左侧内容区 -->
      <div class="left-content">
        <!-- 日期显示组件 -->
        <div class="card date-card">
          <div class="date-display">
            <div class="date">{{ formattedDate }}</div>
            <div class="day">{{ formattedDay }}</div>
          </div>
        </div>

        <!-- 热门标签云 -->
        <div class="card tags-card">
          <h2>热门标签</h2>
          <el-divider></el-divider>
          <div class="tag-cloud">
            <el-tag
                v-for="tag in hotTags"
                :key="tag.name"
                :type="tag.type"
                size="medium"
                class="tag-item"
                @click="searchByTag(tag)">
              {{ tag.name }} ({{ tag.count }})
            </el-tag>
          </div>
        </div>

        <!-- 学习进度环形图 -->
        <div class="card progress-card">
          <h2>学习进度</h2>
          <el-divider></el-divider>
          <div class="progress-chart" ref="progressChart">
            <el-empty v-if="error" :description="error"></el-empty>
            <el-skeleton v-else-if="loading" :rows="5" animated></el-skeleton>
          </div>
        </div>
      </div>

      <!-- 中间内容区 -->
      <div class="middle-content">
        <!-- 近期比赛模块 -->
        <div class="card upcoming-competitions">
          <h2>比赛 Recent</h2>
          <el-divider></el-divider>
          <el-table :data="sortedCompetitions" style="width: 100%">
            <el-table-column prop="name" label="比赛名称" width="180"></el-table-column>
            <el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>
            <el-table-column prop="duration" label="比赛时长"></el-table-column>
            <el-table-column label="状态" width="120">
              <template #default="{row}">
                <el-tag :type="getCompetitionStatus(row).type" size="small">
                  {{ getCompetitionStatus(row).text }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{row}">
                <el-button type="text" @click="viewCompetition(row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 临期作业模块 -->
        <div class="card urgent-homework">
          <h2>作业 DeadLine</h2>
          <el-divider></el-divider>
          <el-table :data="urgentHomework" style="width: 100%">
            <el-table-column prop="name" label="作业名称" width="200"></el-table-column>
            <el-table-column prop="deadline" label="截止时间" width="180"></el-table-column>
            <el-table-column label="剩余时间" width="150">
              <template #default="{row}">
                {{ calculateRemainingTime(row.deadline) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="120">
              <template #default="{row}">
                <el-tag :type="row.completed ? 'success' : 'danger'" size="small">
                  {{ row.completed ? '已完成' : '未完成' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{row}">
                <el-button type="text" @click="viewHomework(row)">去完成</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 近期活动时间轴 -->
        <div class="card activity-timeline">
          <div class="timeline-header">
            <h2>近期活动</h2>
            <el-divider></el-divider>
          </div>
          <div class="timeline-content">
            <el-timeline>
              <el-timeline-item
                  v-for="activity in recentActivities"
                  :key="activity.id"
                  :timestamp="activity.time"
                  :color="activity.color"
                  placement="top">
                <el-card shadow="hover" class="activity-card" :style="{borderLeft: `3px solid ${activity.color}`}">
                  <div class="activity-header">
                    <h4>{{ activity.title }}</h4>
                    <el-tag size="mini" :color="activity.color" effect="dark">
                      {{ getActivityStatus(activity.time) }}
                    </el-tag>
                  </div>
                  <p class="activity-content">{{ activity.content }}</p>
                  <div class="activity-footer">
                    <span class="activity-time">{{ activity.time }}</span>
                    <el-button size="mini" type="primary" @click="viewActivity(activity)">详情</el-button>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      // 页面加载状态
      loading: false,
      error: null,

      // 统计卡片数据
      stats: [
        { title: '学习时长', value: '128h', icon: 'el-icon-time', color: '#409EFF' },
        { title: '完成题目', value: '86题', icon: 'el-icon-document', color: '#67C23A' },
        { title: '正确率', value: '85%', icon: 'el-icon-success', color: '#E6A23A' },
        {
          title: '连续打卡',
          value: '21天',
          icon: 'el-icon-date',
          color: '#F56C6C',
          isChecked: false,
          canCheck: true
        }
      ],

      // 热门标签数据
      hotTags: [
        { name: '动态规划', count: 56, type: '', color: '#409EFF' },
        { name: '树结构', count: 42, type: 'success', color: '#67C23A' },
        { name: '图论', count: 38, type: 'warning', color: '#E6A23C' },
        { name: '字符串', count: 35, type: 'danger', color: '#F56C6C' },
        { name: '数组', count: 32, type: 'info', color: '#909399' }
      ],

      // 近期活动数据
      recentActivities: [
        { id: 1, time: '2023-05-10', title: '参加了算法竞赛', content: '获得第3名成绩', color: '#67C23A' },
        { id: 2, time: '2023-05-08', title: '完成了作业', content: '动态规划作业满分', color: '#409EFF' },
        { id: 3, time: '2023-05-05', title: '学习新知识点', content: '掌握了图论算法', color: '#E6A23C' }
      ],

      // 星期数据
      weekDays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    }
  },
  computed: {
    // 格式化当前日期
    formattedDate() {
      const today = new Date();
      return `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日`;
    },

    // 获取当前星期
    formattedDay() {
      return this.weekDays[new Date().getDay()];
    }
  },
  mounted() {
    this.initProgressChart();
    window.addEventListener('resize', this.handleResize);

    // 检查今天是否已打卡，与用户ID绑定
    const userId = this.$store.state.user?.id || 'anonymous';
    const lastCheckIn = localStorage.getItem(`lastCheckIn_${userId}`);
    const today = new Date().toDateString();
    if (lastCheckIn === today) {
      const checkCard = this.stats.find(s => s.title === '连续打卡');
      if (checkCard) {
        checkCard.isChecked = true;
        checkCard.canCheck = false;
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.progressChart) {
      this.progressChart.dispose();
    }
  },
  methods: {
    /**
     * 初始化进度图表
     */
    async initProgressChart() {
      try {
        this.loading = true;
        this.error = null;

        if (this.progressChart) {
          this.progressChart.dispose();
        }

        this.progressChart = echarts.init(this.$refs.progressChart);
        this.handleResize();

        const option = {
          tooltip: { trigger: 'item' },
          series: [{
            name: '学习进度',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {c} ({d}%)'
            },
            emphasis: {
              label: { show: true, fontSize: '14', fontWeight: 'bold' }
            },
            data: [
              { value: 35, name: '数据结构', itemStyle: { color: '#409EFF' } },
              { value: 30, name: '算法', itemStyle: { color: '#67C23A' } },
              { value: 25, name: '编程语言', itemStyle: { color: '#E6A23C' } },
              { value: 10, name: '其他', itemStyle: { color: '#F56C6C' } }
            ]
          }]
        };

        this.progressChart.setOption(option);
      } catch (err) {
        console.error('图表初始化失败:', err);
        this.error = '图表加载失败，请刷新重试';
      } finally {
        this.loading = false;
      }
    },

    // 根据标签搜索
    searchByTag(tag) {
      this.$router.push(`/problems?tag=${tag.name}`);
    },

    // 处理窗口大小变化
    handleResize() {
      if (this.progressChart) {
        this.progressChart.resize();
      }
    },

    // 获取活动状态
    getActivityStatus(date) {
      const now = new Date();
      const activityDate = new Date(date);
      return now > activityDate ? '已完成' : '进行中';
    },

    // 打卡方法
    checkIn() {
      const checkCard = this.stats.find(s => s.title === '连续打卡');
      if (checkCard && checkCard.canCheck) {
        checkCard.isChecked = true;
        checkCard.canCheck = false;
        checkCard.value = `${parseInt(checkCard.value) + 1}天`;
        this.$message.success('打卡成功！');

        // 存储当天打卡状态，与用户ID绑定
        const today = new Date().toDateString();
        const userId = this.$store.state.user?.id || 'anonymous';
        localStorage.setItem(`lastCheckIn_${userId}`, today);
      }
    },
  }
}
</script>

<style scoped>
/* 活动卡片样式 */
.activity-card {
  margin: 5px 0;
  transition: all 0.3s;
}

.activity-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.activity-header h4 {
  margin: 0;
  font-size: 16px;
}

.activity-content {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-time {
  font-size: 12px;
  color: #999;
}
</style>

<style scoped>
.date-card {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  height: 200px;
}

.date-display {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.date {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.day {
  font-size: 24px;
  color: #67C23A;
}

</style>

<style scoped>
.home {
  padding: 20px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 24px;
  display: flex;
  align-items: center;
  transition: transform 0.2s;
  position: relative;
}

.checkin-layout {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.stat-left {
  flex: 1;
}

.stat-right {
  width: 120px;
  margin-left: 20px;
}

.checkin-button {
  width: 100%;
}

.checked-tag {
  width: 100%;
  text-align: center;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 36px;
  margin-right: 15px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-title {
  font-size: 14px;
  color: #909399;
}

.main-content {
  display: grid;
  grid-template-columns: 0.8fr 2.2fr;
  gap: 24px;
  margin-top: 24px;
}

.left-content {
  display: flex;
  flex-direction: column;
}

.middle-content {
  display: flex;
  flex-direction: column;
}

/* 卡片基础样式 */
.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 24px;
  transition: all 0.3s;
  margin-bottom: 24px;
}

.card:hover {
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

.progress-chart {
  height: 320px;
  padding: 15px;
  margin: -10px;
}

.progress-card {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  cursor: pointer;
  transition: all 0.3s;
}

.tag-item:hover {
  transform: scale(1.1);
}

.activity-timeline {
  position: relative;
  padding: 0 10px;
}

.timeline-header {
  background: white;
  padding: 15px 15px 5px;
  margin-bottom: 5px;
}

.timeline-content {
  max-height: 380px;
  overflow-y: auto;
  padding: 0 5px 10px 0;
  margin-top: 10px;
}

.timeline-content::-webkit-scrollbar {
  width: 6px;
}

.timeline-content::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 3px;
}

.timeline-content::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

.el-timeline {
  padding-left: 10px;
}

.el-timeline-item {
  padding-bottom: 15px;
}

.el-timeline-item__timestamp {
  color: #666;
  font-size: 13px;
  margin-bottom: 5px;
}

.bottom-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr;
  }

  .bottom-content {
    grid-template-columns: 1fr;
  }
}
</style>
