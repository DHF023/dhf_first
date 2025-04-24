<template>
  <div class="homework-progress">
    <div class="stats-container">
      <!-- 作业完成情况统计 -->
      <div class="completion-stats">
        <h3>作业完成情况</h3>

        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ completionRate }}%</div>
            <div class="stat-label">总体完成率</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ completedCount }}/{{ totalCount }}</div>
            <div class="stat-label">已完成作业</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ avgScore }}分</div>
            <div class="stat-label">平均得分</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ timeSpent }}小时</div>
            <div class="stat-label">总用时</div>
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-box">
            <h4>各科得分分布</h4>
            <div ref="scoreChart" style="height: 300px;"></div>
          </div>
          <div class="chart-box">
            <h4>完成时间趋势</h4>
            <div ref="timeChart" style="height: 300px;"></div>
          </div>
        </div>

        <div class="homework-details">
          <h4>各科作业详情</h4>
          <el-table :data="homeworkData" style="width: 100%">
            <el-table-column prop="name" label="作业名称" width="180"></el-table-column>
            <el-table-column label="完成状态" width="120">
              <template #default="{row}">
                <el-tag :type="row.completed ? 'success' : 'danger'" size="medium">
                  {{ row.completed ? '已完成' : '未完成' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="score" label="得分" width="100"></el-table-column>
            <el-table-column prop="time" label="用时(小时)" width="120"></el-table-column>
            <el-table-column prop="submitDate" label="提交日期"></el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 错题分析 -->
      <div class="error-analysis">
        <h3>错题分析</h3>

        <div class="error-stats">
          <div class="error-stat-item">
            <span class="error-stat-label">总错题数:</span>
            <span class="error-stat-value">{{ totalErrors }}题</span>
          </div>
          <div class="error-stat-item">
            <span class="error-stat-label">错误率:</span>
            <span class="error-stat-value">{{ errorRate }}%</span>
          </div>
          <div class="error-stat-item">
            <span class="error-stat-label">高频错误类型:</span>
            <span class="error-stat-value">{{ commonErrorType }}</span>
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-box">
            <h4>错题类型分布</h4>
            <div ref="errorTypeChart" style="height: 300px;"></div>
          </div>
          <div class="chart-box">
            <h4>各科错误率对比</h4>
            <div ref="subjectChart" style="height: 300px;"></div>
          </div>
        </div>

        <div class="error-list">
          <h4>详细错题列表</h4>
          <el-table :data="errorList" style="width: 100%">
            <el-table-column prop="question" label="题目内容" width="300"></el-table-column>
            <el-table-column prop="type" label="错误类型" width="120"></el-table-column>
            <el-table-column prop="homework" label="所属作业" width="150"></el-table-column>
            <el-table-column prop="correctAnswer" label="正确答案"></el-table-column>
            <el-table-column prop="yourAnswer" label="你的答案"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { initChart } from '@/echarts/chart.js'
import { barCompletion } from '@/echarts/barCompletion.js'
import { lineWeek } from '@/echarts/lineWeek.js'
import { pieErrorAnalysis } from '@/echarts/pieErrorAnalysis.js'
import { radarAbility } from '@/echarts/radarAbility.js'

export default {
  data() {
    return {
      completionRate: 78,
      completedCount: 3,
      totalCount: 4,
      avgScore: 82.5,
      timeSpent: 24,
      totalErrors: 15,
      errorRate: 18,
      commonErrorType: "概念理解错误",
      homeworkData: [
        { name: '作业1-基础语法', completed: true, score: '85', time: 6, submitDate: '2023-05-10' },
        { name: '作业2-数据结构', completed: true, score: '90', time: 8, submitDate: '2023-05-17' },
        { name: '作业3-算法设计', completed: false, score: '-', time: '-', submitDate: '-' },
        { name: '作业4-项目实践', completed: true, score: '80', time: 10, submitDate: '2023-05-24' }
      ],
      errorList: [
        { question: "关于指针的定义和使用", type: "概念理解", homework: "作业1-基础语法", correctAnswer: "指针存储的是内存地址", yourAnswer: "指针存储的是变量值" },
        { question: "二叉树遍历顺序", type: "记忆错误", homework: "作业2-数据结构", correctAnswer: "前序:根左右", yourAnswer: "前序:左根右" },
        { question: "快速排序时间复杂度", type: "计算错误", homework: "作业2-数据结构", correctAnswer: "O(nlogn)", yourAnswer: "O(n²)" },
        { question: "动态规划状态转移", type: "逻辑错误", homework: "作业4-项目实践", correctAnswer: "dp[i]=dp[i-1]+dp[i-2]", yourAnswer: "dp[i]=dp[i-1]+1" }
      ]
    }
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    initCharts() {
      this.scoreChart = initChart(this.$refs.scoreChart, barCompletion)
      this.timeChart = initChart(this.$refs.timeChart, lineWeek)
      this.errorTypeChart = initChart(this.$refs.errorTypeChart, pieErrorAnalysis)
      this.subjectChart = initChart(this.$refs.subjectChart, radarAbility)
    }
  }
}
</script>

<style scoped>
.homework-progress {
  width: 70%;
  margin: 0 auto;
  padding: 20px;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.completion-stats, .error-analysis {
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

.homework-details, .error-list {
  margin-top: 25px;
}

.error-stats {
  display: flex;
  gap: 30px;
  margin: 20px 0;
  padding: 15px;
  background: #fef0f0;
  border-radius: 6px;
}

.error-stat-item {
  display: flex;
  flex-direction: column;
}

.error-stat-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.error-stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
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
