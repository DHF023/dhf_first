<template>
  <div class="progress-tracking">
    <div class="left-card">
      <div class="finish-card">
        <el-tabs v-model="active" style="margin-left: 15px; width:670px;">
          <el-tab-pane label="今日完成数量" name="first" >
            <div style="display: flex;  margin-top: 20px;">
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
        <div ref="pieDifficulty" style="height: 350px; width: 700px; margin-top: 20px; margin-left: 15px;"></div>
      </div>
    </div>
    <div class="right-card">
      <div class="rank-card">
        <el-collapse
          v-model="activeNames"
          accordion>
          <el-collapse-item>
            <template slot="title" name="today">
              <span class="center-span" style="width: 300px; height: 50px; line-height: 50px; font-size: 25px; font-family: 'SimSun';">
                今日排行
              </span>
            </template>
            <el-table :data="todayData" style="margin-left: 15px; width: 270px;">
              <el-table-column
                  prop="rank"
                  label="排名">
              </el-table-column>
              <el-table-column
                  prop="name"
                  label="用户名"
                  width="100">
              </el-table-column>
              <el-table-column
                  prop="num"
                  label="完成数量">
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item>
            <template slot="title" name="week">
              <span class="center-span" style="width: 300px; height: 50px; line-height: 50px; font-size: 25px; font-family: 'SimSun';">
                本周排行
              </span>
            </template>
            <el-table :data="todayData" style="margin-left: 15px; width: 270px;">
              <el-table-column
                  prop="rank"
                  label="排名">
              </el-table-column>
              <el-table-column
                  prop="name"
                  label="用户名"
                  width="100">
              </el-table-column>
              <el-table-column
                  prop="num"
                  label="完成数量">
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item>
            <template slot="title" name="week">
              <span class="center-span" style="width: 300px; height: 50px; line-height: 50px; font-size: 25px; font-family: 'SimSun';">
                本月排行
              </span>
            </template>
            <el-table :data="todayData" style="margin-left: 15px; width: 270px;">
              <el-table-column
                  prop="rank"
                  label="排名">
              </el-table-column>
              <el-table-column
                  prop="name"
                  label="用户名"
                  width="100">
              </el-table-column>
              <el-table-column
                  prop="num"
                  label="完成数量">
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item>
            <template slot="title" name="week">
              <span class="center-span" style="width: 300px; height: 50px; line-height: 50px; font-size: 25px; font-family: 'SimSun';">
                累计排行
              </span>
            </template>
            <el-table :data="todayData" style="margin-left: 15px; width: 270px;">
              <el-table-column
                  prop="rank"
                  label="排名">
              </el-table-column>
              <el-table-column
                  prop="name"
                  label="用户名"
                  width="100">
              </el-table-column>
              <el-table-column
                  prop="num"
                  label="完成数量">
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { initChart } from '@/echarts/chart.js'; // 导入 initChart 函数
import { lineWeek } from '@/echarts/lineWeek.js';
import { lineMonth } from '@/echarts/lineMonth.js';
import { pieDifficulty } from '@/echarts/pieDifficulty.js';

export default {
  name: 'progress-tracking',
  data () {
    return {
      active: 'first',
      todayFinish: '2',
      totalFinish: '99',
      activeNames: 'today',
      todayData: [{rank: '1', name: '张三', num: '10'}, {rank: '2', name: '李四', num: '9'}, {rank: '3', name: '王五', num: '7'}]
    }
  },
  mounted() {
    let chartDomWeek = this.$refs.lineWeek;
    this.myChart = initChart(chartDomWeek, lineWeek);
    let chartDomMonth = this.$refs.lineMonth;
    this.myChart = initChart(chartDomMonth, lineMonth);
    let chartDomDifficulty = this.$refs.pieDifficulty;
    this.myChart = initChart(chartDomDifficulty, pieDifficulty);
  },
  methods: {
    gotoProblemList () {
      this.$router.push("/problem-list");
    },
  }
};
</script>

<style scoped>
.progress-tracking {
  min-height: calc(100vh - 60px);
  overflow: auto;
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
}

.left-card {
  position: relative;
  width: 700px;
  margin-left: 300px;
  margin-bottom: 60px;
}

.right-card {
  position: relative;
  width: 270px;
  margin-left: 20px;
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

.rank-card {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  max-height: none;
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