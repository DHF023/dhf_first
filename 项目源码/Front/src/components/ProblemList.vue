<template>
  <div class="problem-list">
    <div class="main">
      <div class="search">
        <el-input v-model="params.num" clearable style="width: 110px" placeholder="请输入编号"></el-input>
        <el-input v-model="params.name" clearable style="width: 160px; margin-left: 10px" placeholder="请输入题目名称"></el-input>
        <el-button style="margin-left: 10px" type="warning" @click="findBySearch()">搜索</el-button>
      </div>
      <div class="table">
        <el-table :data="problem">
          <el-table-column prop="state" label="状态" width="70"></el-table-column>
          <el-table-column prop="id" label="编号" width="100"></el-table-column>
          <el-table-column prop="title" label="题目名称" width="300">
            <template v-slot="scope">
              <router-link :to="'/problem/' + scope.row.id" class="title-link">{{ scope.row.title }}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="tag" label="标签">
            <template slot-scope="scope">
              <el-tag>{{ scope.row.tag }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="difficulty" label="难度">
            <template slot-scope="scope">
              <el-tag type="success">{{ scope.row.difficulty }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pass" label="通过率">
            <el-progress :percentage="50"></el-progress>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <div class="word-cloud">
      <div style="height: 50px; display: flex; align-items: center;">
        <span style="font-size: 20px; margin-left: 15px; font-family: 'PingFang SC'">标签云</span>
      </div>
      <el-divider class="divider"></el-divider>
      <div style="width: 100%; height: 300px; display: flex; justify-content: center; align-items: center;">
        <canvas ref="wordCloudCanvas" width="225" height="275" style="width: 200px; height: 260px; cursor: default"></canvas>
      </div>

    </div>
  </div>
</template>

<script>
import { problems } from "@/data/problems.js";
import {word} from "@/data/wordCloud.js";

export default {
  data() {
    return {
      problem: problems,
      params:{
        num: '',
        name: '',
      },
      total: problems.length,
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
    };
  },
  created() {
  },
  mounted() {
    this.drawWordCloud();
  },
  methods: {
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize;
    },
    handleCurrentChange(pageNum) {
      this.params.pageNum = pageNum;
    },
    drawWordCloud() {
      const canvas = this.$refs.wordCloudCanvas;
      const ctx = canvas.getContext('2d');

      const words = word;

      const padding = 10; // 单词之间的间距
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      let currentX = padding;
      let currentY = padding;
      let maxRowHeight = 0; // 用于记录当前行的最大高度

      words.forEach((word) => {
        ctx.font = `${word.size}px Arial`;
        const wordWidth = ctx.measureText(word.text).width;

        // 使用 measureText 方法无法直接获得高度，因此我们需要近似计算
        const wordHeight = word.size; // 近似的高度
        const descent = word.size * 0.5; // 近似下降值，根据字体不同可能需要调整

        // 如果当前单词超出画布宽度，换行
        if (currentX + wordWidth > canvasWidth) {
          currentX = padding;
          currentY += maxRowHeight + padding;
          maxRowHeight = 0; // 重置当前行的最大高度
        }

        // 绘制单词
        ctx.fillStyle = word.color;
        ctx.fillText(word.text, currentX, currentY + descent);

        // 更新当前行的最大高度
        maxRowHeight = Math.max(maxRowHeight, wordHeight);

        // 更新下一个单词的起始位置
        currentX += wordWidth + padding;
      });
    }
  }
};
</script>

<style scoped>
.problem-list {
  overflow: auto;
  min-height: calc(100vh - 60px);
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
}

.main {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  width: 57%;
  margin-left: 190px;
  margin-bottom: 60px;
}

.word-cloud {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  width: 18%;
  height: 350px;
  margin-left: 15px;
}

.search {
  margin-top: 15px;
  margin-left: 15px;
}

.table {
  width: 97%;
  margin-top: 5px;
  margin-left: 15px;
}

.block {
  margin-top: 10px;
  margin-left: 15px;
  margin-bottom: 10px;
}

.title-link {
  text-decoration: none; /* 去掉下划线 */
  color: #dba800; /* 更改字体颜色，这里以绿色为例 */
}

.divider {
  width: 100%;
  margin: 0 0;
}
</style>