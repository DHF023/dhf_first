<template>
  <div class="competition">
    <div class="main">
      <!-- 标题部分 -->
      <div class="header">
        <span style="line-height: 60px; font-size: 24px; font-weight: bold;">{{competition.title }}</span>
      </div>
      <!-- 按钮区域 -->
      <div style="display: flex; justify-content: center;">
        <el-button type="text" @click="gotoList" class="text-button"><span style="color: #000000; font-size: 14px;">题目列表</span></el-button>
        <el-button type="text" @click="gotoRecord" class="text-button"><span style="color: #000000; font-size: 14px;">所有提交</span></el-button>
        <el-button type="text" @click="gotoRank" class="text-button"><span style="color: #000000; font-size: 14px;">榜单</span></el-button>
      </div>
      <!-- 题目列表显示部分 -->
      <div v-if="isList === true">
        <div style="display: flex; justify-content: center;">
          <div class="table">
            <el-table :data="competitionProblems" border>
              <el-table-column prop="id" label="#" width="130"></el-table-column>
              <el-table-column prop="title" label="标题">
                <!-- 题目链接 -->
                <template v-slot="scope">
                  <router-link :to="'/competition-problem/' + scope.row.id" class="title-link">{{ scope.row.title }}</router-link>
                </template>
              </el-table-column>
              <el-table-column prop="num" label="已解出" width="130"></el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 竞赛信息展示 -->
        <div style="margin: 0 100px;">
          <span style="line-height: 15px;">
            时长: {{ competition.time }}<br>
            开始时间: {{ competition.startDate }}
          </span>
        </div>
      </div>
      <!-- 所有提交显示区域 -->
      <div style="display: flex; justify-content: center;" v-if="isRecord === true">
        <!-- 所有提交显示区域 -->
      </div>
      <!-- 榜单显示区域 -->
      <div style="display: flex; justify-content: center;" v-if="isRank === true">
        <!-- 榜单显示区域 -->
      </div>
    </div>




  </div>
</template>


<script>
import { competitionProblems } from "@/data/competition-problems.js";


export default {
  name: 'competition',
  props: ['id'],
  data() {
    return {
      competitionProblems: competitionProblems,
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      isList: true,
      isRecord: false,
      isRank: false,
    };
  },
  computed: {
    competition() {
      const competition = require('@/data/competition.js').competition;
      return competition.find(c => c.id === this.id);
    },
  },
  methods: {
    gotoList() {
      this.isList = true;
      this.Record = false;
      this.isRank = false;
    },
    gotoRecord() {
      this.isList = false;
      this.Record = true;
      this.isRank = false;
    },
    gotoRank() {
      this.isList = false;
      this.Record = false;
      this.isRank = true;
    }
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


.table {
  width: 80%;
  margin: 30px 0;
}


.title-link {
  text-decoration: none; /* 去掉下划线 */
  color: #dba800; /* 更改字体颜色，这里以绿色为例 */
}


.text-button:hover {
  font-weight: bold;
}
</style>
