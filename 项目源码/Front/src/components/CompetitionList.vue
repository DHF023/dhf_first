<template>
  <div class="competition-list">
    <div class="main">
      <!-- 搜索区域 -->
      <div class="search">
        <el-input clearable style="width: 150px" placeholder="请输入比赛名称"></el-input>
        <el-button style="margin-left: 10px" type="warning" @click="">搜索</el-button>
        <!-- 根据用户角色判断是否显示“发起比赛”按钮 -->
        <el-button style="margin-left: 10px" type="primary" @click="" v-if="user.role === '教师' || user.role === 'ROLE_ADMIN' ">发起比赛</el-button>
      </div>
      <!-- 表格区域 -->
      <div class="table">
        <el-table :data="tableData">
          <el-table-column prop="title" label="比赛名称" width="260">
            <!-- 自定义显示比赛名称的模板 -->
            <template v-slot="scope">
              <a href="javascript:void(0);" @click="openCompetitionDetail(scope.row.id)" class="title-link">{{ scope.row.title }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="开始时间" width="200"></el-table-column>
          <el-table-column prop="time" label="时长" width="100"></el-table-column>
          <el-table-column prop="num" label="题数" width="80"></el-table-column>
          <!-- 带筛选功能的表格列 -->
          <el-table-column prop="state" label="状态" width="100"
           :filters="[{text: '未开始', value: '未开始'}, {text: '进行中', value: '进行中'}, {text: '已结束', value: '已结束'}]"
           :filter-method="filterHandler"></el-table-column>
          <el-table-column prop="host" label="举办者" width="100"></el-table-column>
          <!-- 自定义显示榜单链接的模板 -->
          <el-table-column fixed="right" prop="rank" label="榜单">
            <template v-slot="scope">
              <a :href="'/competition/' + scope.row.id + '/rank'" target="_blank" class="rank-link">查看</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页区域 -->
      <div class="block">
        <el-pagination
            @current-change="handleCurrentChange"
            :current-page="params.pageNum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="params.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>


<script>
import {competition} from "@/data/competition.js";
export default {
  name: 'competition',
  data() {
    return {
      // 从localStorage中获取用户信息，若无则返回一个空对象
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      tableData: competition,
      params: {},
      total: competition.length,
    }
  },
  methods: {
    // 自定义筛选方法
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    openCompetitionDetail(competitionId) {
      const url = `/competition/${competitionId}`;
      window.open(url, '_blank'); // 在新窗口中打开该URL
    }
  }
}
</script>


<style scoped>
.competition-list {
  min-height: calc(100vh - 60px);
  overflow: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}


.main {
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  width: 65%;
  margin-bottom: 60px;
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


.rank-link {
  text-decoration: none; /* 去掉下划线 */
  color: #528fff; /* 更改字体颜色，这里以绿色为例 */
}
</style>
