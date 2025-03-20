<template>
  <div class="record">
    <el-breadcrumb separator="/" style="margin-bottom: 10px; margin-left: 10px; font-size: 16px;">
      <el-breadcrumb-item :to="{ path: '/problem-list' }">题库</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'Problem', params: { id: this.id } }">{{ problem.title }}</el-breadcrumb-item>
      <el-breadcrumb-item><a>提交记录</a></el-breadcrumb-item>
    </el-breadcrumb>

    <div class="main">
      <el-table :data="record" class="table">
        <el-table-column prop="state" label="状态"></el-table-column>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="title" label="题目"></el-table-column>
        <el-table-column prop="time" label="完成时间"></el-table-column>
        <el-table-column prop="num" label="提交次数"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { records } from "@/data/records";
import {problems} from "@/data/problems";

export default {
  name: 'record',
  props: ['id'],
  data() {
    return {
      record: records,
      problems: problems,
    }
  },
  computed: {
    problem() {
      const problems = require('@/data/problems.js').problems;
      return problems.find(p => p.id === this.id);
    },
  },
};
</script>

<style scoped>
.record {
  min-height: 100vh;
  overflow: auto;
  margin-top: 10px;
  margin-bottom: 20px;
}

.main {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  min-height: 100vh;
  width: 60%;
  margin-left: 300px;
  margin-bottom: 50px;
}

.table {
  width: 97%;
  margin-left: 15px ;
  margin-bottom: 50px;
}
</style>
