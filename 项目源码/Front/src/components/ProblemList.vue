<template>
  <div class="problem-list">
    <div class="main">
      <div class="search">
        <el-input v-model="params.num" clearable style="width: 110px" placeholder="请输入编号"></el-input>
        <el-input v-model="params.name" clearable style="width: 160px; margin-left: 10px" placeholder="请输入题目名称"></el-input>
        <el-button style="margin-left: 10px" type="warning" @click="findBySearch()">搜索</el-button>
        <el-button style="margin-left: 10px" type="primary" @click="showAddDialog = true" v-if="user.role === '教师' || user.role === 'ROLE_ADMIN' ">添加题目</el-button>
      </div>
      <div class="table">
        <el-table :data="problem">
          <el-table-column prop="state" label="状态" width="70"></el-table-column>
          <el-table-column prop="id" label="编号" width="100"></el-table-column>
          <el-table-column prop="title" label="题目名称" width="250">
            <template v-slot="scope">
              <a href="javascript:void(0);" @click="openProblemDetail(scope.row.id)" class="title-link">{{ scope.row.title }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="tags" label="标签" width="200">
            <template slot-scope="scope">
              <el-tag
                  v-for="(tag, index) in scope.row.tags.slice(0, 2)"
                  :key="index"
                  type="info"
                  style="margin-right: 5px; cursor: pointer;"
                  @click="filterByTag(tag)"
              >
                {{ tag }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="difficulty" label="难度" width="100"
            :filters="[
               { text: '简单', value: '简单' },
               { text: '中等', value: '中等' },
               { text: '困难', value: '困难' }
            ]"
            :filter-method="filterDifficulty">
            <template slot-scope="scope">
              <el-tag :type="getTagType(scope.row.difficulty)">
                {{ scope.row.difficulty }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pass" label="通过率" width="80">
            <template slot-scope="scope">
              {{ scope.row.pass }}%
            </template>
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
    <!-- 添加题目对话框 -->
    <el-dialog
        title="添加题目"
        :visible.sync="showAddDialog"
        width="30%">
      <el-form>
        <el-form-item>
          <el-radio-group v-model="addType">
            <el-radio label="添加单个题目" style="display: block; margin-bottom: 50px; color: black;" class="el-radio-text1"></el-radio>
            <el-radio label="批量添加题目" style="display: block; color: black;" class="el-radio-text2"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button @click="showAddDialog = false">取 消</el-button>
          <el-button type="primary" @click="handleAddProblem">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { problems } from "@/data/problems.js";

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
      showAddDialog: false,
      addType: 'single',
    };
  },
  created() {
  },
  mounted() {

  },
  methods: {
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize;
    },
    handleCurrentChange(pageNum) {
      this.params.pageNum = pageNum;
    },
    openProblemDetail(problemId) {
      const url = `/problem/${problemId}`; // 确保这是Problem.vue组件所对应的路由
      window.open(url, '_blank'); // 在新窗口中打开该URL
    },
    // 处理添加题目对话框的确定按钮点击事件
    handleAddProblem() {
      this.showAddDialog = false;
      if (this.addType === '添加单个题目') {
        // 导航到添加单个题目的页面
        this.$router.push('/add-single-problem');
      } else if (this.addType === '批量添加题目') {
        // 导航到批量添加题目的页面
        this.$router.push('/add-batch-problems');
      }
    },
    filterByTag(tag) {
      // 假设我们有一个原始题目列表存储在 this.originalProblems 中
      // 如果没有，可以在 created 或 mounted 钩子中初始化 this.originalProblems = this.problems.slice();
      if (!this.originalProblems) {
        this.originalProblems = this.problems.slice();
      }

      // 筛选包含指定标签的题目
      this.problem = this.originalProblems.filter(problem => problem.tags.includes(tag));

      // 可能还需要重置分页参数等
      this.params.pageNum = 1;
      this.params.pageSize = this.params.pageSizes[0];
    },
    getTagType(difficulty) {
      switch (difficulty) {
        case '简单':
          return 'success';
        case '中等':
          return 'warning';
        case '困难':
          return 'danger';
        default:
          return '';
      }
    },
    filterDifficulty(value, row, column) {
      return row.difficulty === value;
    },
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
  justify-content: center;
}

.main {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  width: 55%;
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

.divider {
  width: 100%;
  margin: 0 0;
}

.el-radio-text1::after {
  content: '（手动编辑题目detail）';
  display: block;
  margin: 10px 24px;
  font-size: 12px;
  font-weight: lighter;
}
.el-radio-text2::after {
  content: '（批量导入题目）';
  display: block;
  margin: 10px 24px;
  font-size: 12px;
  font-weight: lighter;
}
</style>