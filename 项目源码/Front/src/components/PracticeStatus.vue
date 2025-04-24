<template>
  <div class="practice-status">
    <div class="stats-container">
      <!-- 练习统计信息 -->
      <div class="practice-stats">
        <h3>练习概况</h3>

        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ totalQuestions }}</div>
            <div class="stat-label">总题数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ completedCount }}</div>
            <div class="stat-label">已完成</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ accuracyRate }}%</div>
            <div class="stat-label">正确率</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ avgTime }}min</div>
            <div class="stat-label">平均用时</div>
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-box">
            <h4>每日练习量</h4>
            <div ref="dailyChart" style="height: 300px;"></div>
          </div>
          <div class="chart-box">
            <h4>题目类型分布</h4>
            <div ref="typeChart" style="height: 300px;"></div>
          </div>
        </div>
      </div>

      <!-- 题目分析 -->
      <div class="question-analysis">
        <h3>题目分析</h3>

        <div class="analysis-stats">
          <div class="analysis-stat-item">
            <span class="analysis-stat-label">最高正确率题型:</span>
            <span class="analysis-stat-value">{{ bestType }} ({{ bestTypeRate }}%)</span>
          </div>
          <div class="analysis-stat-item">
            <span class="analysis-stat-label">最低正确率题型:</span>
            <span class="analysis-stat-value">{{ worstType }} ({{ worstTypeRate }}%)</span>
          </div>
          <div class="analysis-stat-item">
            <span class="analysis-stat-label">最近进步最大:</span>
            <span class="analysis-stat-value">{{ improvedType }} (+{{ improvedRate }}%)</span>
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-box">
            <h4>题目难度分布</h4>
            <div ref="difficultyChart" style="height: 300px;"></div>
          </div>
          <div class="chart-box">
            <h4>标签分类统计</h4>
            <div ref="tagChart" style="height: 300px;"></div>
          </div>
        </div>

        <div class="question-details">
          <h4>详细题目列表</h4>
          <el-table :data="questionList" style="width: 100%">
            <el-table-column prop="title" label="题目名称" width="250"></el-table-column>
            <el-table-column prop="type" label="题型" width="120"></el-table-column>
            <el-table-column prop="difficulty" label="难度" width="100">
              <template #default="{row}">
                <el-tag :type="getDifficultyTag(row.difficulty)" size="small">
                  {{ row.difficulty }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120">
              <template #default="{row}">
                <el-tag :type="row.status === '已完成' ? 'success' : 'warning'" size="small">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="用时(min)" width="120"></el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{row}">
                <el-button type="text" @click="viewDetail(row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { initChart } from '@/echarts/chart.js'
import { lineWeek } from '@/echarts/lineWeek.js'
import { pieType } from '@/echarts/pieType.js'
import { pieDifficulty } from '@/echarts/pieDifficulty.js'
import { barTagAnalysis } from '@/echarts/barTagAnalysis.js'

export default {
  data() {
    return {
      totalQuestions: 256,
      completedCount: 189,
      accuracyRate: 85,
      avgTime: 2.3,
      bestType: "数组",
      bestTypeRate: 92,
      worstType: "动态规划",
      worstTypeRate: 68,
      improvedType: "树结构",
      improvedRate: 15,
      questionList: [
        { title: "两数之和", type: "数组", difficulty: "简单", status: "已完成", time: 1.5 },
        { title: "反转链表", type: "链表", difficulty: "中等", status: "已完成", time: 3.2 },
        { title: "最长公共子序列", type: "动态规划", difficulty: "困难", status: "未完成", time: "-" },
        { title: "二叉树遍历", type: "树结构", difficulty: "中等", status: "已完成", time: 2.8 }
      ]
    }
  },
  mounted() {
    this.initDailyChart()
    this.initTypeChart()
    this.initDifficultyChart()
    this.initTagChart()
  },
  methods: {
    initDailyChart() {
      const chartDom = this.$refs.dailyChart
      this.chart = initChart(chartDom, lineWeek)
    },
    initTypeChart() {
      const chartDom = this.$refs.typeChart
      this.chart = initChart(chartDom, pieType)
    },
    initDifficultyChart() {
      const chartDom = this.$refs.difficultyChart
      this.chart = initChart(chartDom, pieDifficulty)
    },
    initTagChart() {
      const chartDom = this.$refs.tagChart
      this.chart = initChart(chartDom, barTagAnalysis)
    },
    getDifficultyTag(difficulty) {
      const map = {
        '简单': 'success',
        '中等': 'warning',
        '困难': 'danger'
      }
      return map[difficulty] || ''
    },
    viewDetail(row) {
      this.$message.info(`查看题目详情: ${row.title}`)
    }
  }
}
</script>

<style scoped>
.practice-status {
  width: 70%;
  margin: 0 auto;
  padding: 20px;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.practice-stats, .question-analysis {
  background: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.stat-item {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 6px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.chart-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
}

.chart-box {
  background: #fff;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.analysis-stats {
  display: flex;
  gap: 30px;
  margin: 20px 0;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 6px;
}

.analysis-stat-item {
  display: flex;
  flex-direction: column;
}

.analysis-stat-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.analysis-stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #409EFF;
}

.question-details {
  margin-top: 25px;
}

h3 {
  color: #303133;
  margin-bottom: 20px;
  font-size: 20px;
}

h4 {
  color: #606266;
  margin: 15px 0;
  font-size: 16px;
}
</style>
