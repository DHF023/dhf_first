<template>
  <div class="exam-analysis">
    <div class="stats-container">
      <!-- 考试统计信息 -->
      <div class="exam-stats">
        <h3>考试概况</h3>

        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ avgScore }}分</div>
            <div class="stat-label">平均分</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ highestScore }}分</div>
            <div class="stat-label">最高分</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ improvement }}分</div>
            <div class="stat-label">进步幅度</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ classRank }}/{{ totalStudents }}</div>
            <div class="stat-label">班级排名</div>
          </div>
        </div>
      </div>

      <!-- 图表展示区 -->
      <div class="chart-area">
        <div class="chart-container">
          <div class="chart-box">
            <h4>考试成绩趋势</h4>
            <div ref="scoreTrendChart" style="height: 300px;"></div>
          </div>
          <div class="chart-box">
            <h4>能力图谱</h4>
            <div ref="abilityRadarChart" style="height: 300px;"></div>
          </div>
        </div>

        <div class="prediction-box">
          <h4>下次考试预测</h4>
          <el-progress
              :percentage="predictedScore"
              :format="formatPrediction"
              :color="predictionColor"
              :stroke-width="16">
          </el-progress>
          <p class="prediction-note">基于最近5次考试成绩分析</p>
          <div class="prediction-tips">
            <p>• 薄弱环节: {{ weakArea }}</p>
            <p>• 建议: {{ suggestion }}</p>
          </div>
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
            <span class="error-stat-label">平均错误率:</span>
            <span class="error-stat-value">{{ avgErrorRate }}%</span>
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

        <div class="error-details">
          <h4>详细错题列表</h4>
          <el-table :data="errorList" style="width: 100%">
            <el-table-column prop="question" label="题目内容" width="300"></el-table-column>
            <el-table-column prop="exam" label="所属考试" width="120"></el-table-column>
            <el-table-column prop="type" label="错误类型" width="120"></el-table-column>
            <el-table-column prop="correctAnswer" label="正确答案"></el-table-column>
            <el-table-column prop="yourAnswer" label="你的答案"></el-table-column>
            <el-table-column label="解析" width="150">
              <template #default="{row}">
                <el-button type="text" @click="showAnalysis(row)">查看解析</el-button>
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
import { lineScoreTrend } from '@/echarts/lineScoreTrend.js'
import { radarAbility } from '@/echarts/radarAbility.js'
import { pieErrorAnalysis } from '@/echarts/pieErrorAnalysis.js'
import { barSubject } from '@/echarts/barSubject.js'

export default {
  data() {
    return {
      avgScore: 82.5,
      highestScore: 95,
      improvement: 8,
      classRank: 12,
      totalStudents: 45,
      predictedScore: 82,
      weakArea: "动态规划",
      suggestion: "加强算法思维训练，多做相关练习题",
      totalErrors: 23,
      avgErrorRate: 15.6,
      commonErrorType: "概念理解错误",
      errorList: [
        {
          question: "关于指针的定义和使用",
          exam: "期中考试",
          type: "概念理解",
          correctAnswer: "指针存储的是内存地址",
          yourAnswer: "指针存储的是变量值",
          analysis: "指针变量存储的是内存地址，通过地址可以访问对应的数据..."
        },
        {
          question: "二叉树遍历顺序",
          exam: "月考1",
          type: "记忆错误",
          correctAnswer: "前序:根左右",
          yourAnswer: "前序:左根右",
          analysis: "二叉树前序遍历的顺序是：访问根节点->遍历左子树->遍历右子树..."
        },
        {
          question: "快速排序时间复杂度",
          exam: "单元测试",
          type: "计算错误",
          correctAnswer: "O(nlogn)",
          yourAnswer: "O(n²)",
          analysis: "快速排序平均时间复杂度为O(nlogn)，最坏情况下为O(n²)..."
        }
      ]
    }
  },
  computed: {
    predictionColor() {
      return this.predictedScore >= 80 ? '#67C23A' :
          this.predictedScore >= 60 ? '#E6A23C' : '#F56C6C'
    }
  },
  mounted() {
    this.initScoreTrendChart()
    this.initAbilityRadarChart()
    this.initErrorTypeChart()
    this.initSubjectChart()
  },
  methods: {
    initScoreTrendChart() {
      const chartDom = this.$refs.scoreTrendChart
      this.chart = initChart(chartDom, lineScoreTrend)
    },
    initAbilityRadarChart() {
      const chartDom = this.$refs.abilityRadarChart
      this.chart = initChart(chartDom, radarAbility)
    },
    initErrorTypeChart() {
      const chartDom = this.$refs.errorTypeChart
      this.chart = initChart(chartDom, pieErrorAnalysis)
    },
    initSubjectChart() {
      const chartDom = this.$refs.subjectChart
      this.chart = initChart(chartDom, barSubject)
    },
    formatPrediction() {
      return `预计得分: ${this.predictedScore}分`
    },
    showAnalysis(row) {
      this.$alert(row.analysis, '题目解析', {
        confirmButtonText: '确定',
        customClass: 'analysis-dialog'
      })
    }
  }
}
</script>

<style scoped>
.exam-analysis {
  width: 70%;
  margin: 0 auto;
  padding: 20px;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.exam-stats, .error-analysis {
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

.chart-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.prediction-box {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.prediction-note {
  font-size: 12px;
  color: #909399;
  margin: 10px 0;
}

.prediction-tips {
  background: #f0f9eb;
  padding: 15px;
  border-radius: 6px;
  margin-top: 15px;
}

.prediction-tips p {
  margin: 5px 0;
  color: #67c23a;
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

.error-details {
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

<style>
.analysis-dialog {
  width: 60%;
  max-width: 800px;
}
</style>
