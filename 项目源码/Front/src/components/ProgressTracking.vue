<template>
  <div class="progress-tracking">
    <div class="left-card">
      <div class="finish-card">
        <el-tabs v-model="active" style="margin-left: 15px; width:670px;">
          <el-tab-pane label="今日完成数量" name="first">
            <div style="display: flex; margin-top: 20px;">
              <div style="width: 350px;">
                <h2 class="center-h2" style="width: 300px;">今日已完成</h2>
                <span class="center-span" style="color: #3260ce; width: 300px; height: 80px; line-height: 80px; font-size: 60px;">{{ todayFinish }}</span>
              </div>
              <div style="width: 350px;">
                <h2 class="center-h2" style="width: 300px;">目前累计完成</h2>
                <span class="center-span" style="color: #c12f40; width: 300px; height: 80px; line-height: 80px; font-size: 60px;">{{ totalFinish }}</span>
              </div>
            </div>
            <div class="center-button" style="margin-top: 15px; width: 670px;">
              <el-button type="warning" @click="gotoProblemList" style="background-color: #5fa0fa; border: none;">去做题</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="本周完成数量" name="second">
            <div ref="lineWeek" style="height: 250px; width: 670px;"></div>
          </el-tab-pane>
          <el-tab-pane label="本月完成数量" name="third">
            <div ref="lineMonth" style="height: 250px; width: 670px;"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="second-card">
        <el-tabs v-model="chartActive" type="card" style="margin: 10px;">
          <el-tab-pane label="难度分布" name="difficulty">
            <div ref="pieDifficulty" style="height: 320px; width: 680px;"></div>
          </el-tab-pane>
          <el-tab-pane label="题型分布" name="type">
            <div ref="pieType" style="height: 320px; width: 680px;"></div>
          </el-tab-pane>
          <el-tab-pane label="正确率趋势" name="accuracy">
            <div ref="lineAccuracy" style="height: 320px; width: 680px;"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { initChart } from '@/echarts/chart.js';
import { lineWeek } from '@/echarts/lineWeek.js';
import { lineMonth } from '@/echarts/lineMonth.js';
import { pieDifficulty } from '@/echarts/pieDifficulty.js';
import { pieType } from '@/echarts/pieType.js';
import { lineAccuracy } from '@/echarts/lineAccuracy.js';

export default {
  name: 'progress-tracking',
  data() {
    return {
      active: 'first',
      chartActive: 'difficulty',
      todayFinish: '2',
      totalFinish: '99',
      accuracyRate: '85%'
    };
  },
  mounted() {
    let chartDomWeek = this.$refs.lineWeek;
    this.myChart = initChart(chartDomWeek, lineWeek);

    let chartDomMonth = this.$refs.lineMonth;
    this.myChart = initChart(chartDomMonth, lineMonth);

    let chartDomDifficulty = this.$refs.pieDifficulty;
    this.myChart = initChart(chartDomDifficulty, pieDifficulty);

    let chartDomType = this.$refs.pieType;
    this.myChart = initChart(chartDomType, pieType);

    let chartDomAccuracy = this.$refs.lineAccuracy;
    this.myChart = initChart(chartDomAccuracy, lineAccuracy);
  },
  methods: {
    gotoProblemList() {
      this.$router.push("/problem-list");
    }
  }
};
</script>

<style scoped>
.progress-tracking {
  min-height: calc(100vh - 60px);
  overflow: auto;
  display: flex;
  padding: 20px 0 20px 0;
}

.left-card {
  position: relative;
  width: 700px;
  margin-left: 300px;
  margin-bottom: 60px;
}

.finish-card {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  height: 300px;
  margin-bottom: 20px;
}

.second-card {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  height: 350px;
}

.center-h2 {
  display: inline-block;
  text-align: center;
}

.center-span {
  display: inline-block;
  text-align: center;
}

.center-button {
  display: inline-block;
  text-align: center;
}
</style>
