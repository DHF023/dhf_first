<template>
  <div class="filter-add-problem">
    <!-- 筛选参数区域 -->
    <div class="filter-params">
      <el-form :model="filterForm" inline>
        <!-- 题目标题筛选项 -->
        <el-form-item label="题目标题">
          <el-input v-model="filterForm.title" placeholder="请输入题目标题" clearable></el-input>
        </el-form-item>
        <!-- 平均难度筛选项 -->
        <el-form-item label="平均难度">
          <el-select v-model="filterForm.difficulty" placeholder="请选择难度">
            <el-option label="简单" value="simple"></el-option>
            <el-option label="中等" value="medium"></el-option>
            <el-option label="困难" value="hard"></el-option>
          </el-select>
        </el-form-item>
        <!-- 题目类型筛选项 -->
        <el-form-item label="题目类型">
          <el-select v-model="filterForm.type" multiple placeholder="请选择类型">
            <el-option label="算法" value="算法"></el-option>
            <el-option label="图论" value="图论"></el-option>
            <!-- 可添加更多题目类型选项 -->
          </el-select>
        </el-form-item>
        <!-- 筛选和重置按钮 -->
        <el-form-item>
          <el-button type="primary" @click="filterProblems">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 题目表格区域 -->
    <div class="problem-table">
      <el-table :data="filteredProblems" border height="250" ref="problemTable">
        <el-table-column type="selection" width="55" label="选择"></el-table-column>
        <el-table-column prop="id" label="#" width="100"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="averageAcceptRate" label="通过率" width="120">
          <template v-slot="scope">
            {{ (scope.row.averageAcceptRate * 100).toFixed(2) }}%
          </template>
        </el-table-column>
        <el-table-column prop="usedTimes" label="使用次数" width="100"></el-table-column>
        <el-table-column prop="tags" label="标签">
          <template v-slot="scope">
            <el-tag v-for="tag in scope.row.tags" :key="tag" type="info" size="mini">{{ tag }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格底部操作区域 -->
      <div class="table-footer">
        <el-button type="primary" @click="addSelectedProblems">添加题目</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import newRequest from '@/utils/newRequest';

export default {
  name: 'FilterAddProblem',
  data() {
    return {
      filterForm: {
        title: '',
        difficulty: '',
        type: ''
      },
      filteredProblems: [], // 存储筛选后的题目列表
      selectedProblems: [] // 存储选中的题目ID
    };
  },
  methods: {
    async filterProblems() {
      // 筛选题目
      try {
        const response = await newRequest.post('/api/problems/filter', this.filterForm);
        if (response.success) {
          this.filteredProblems = response.data;
        } else {
          this.$message.error('筛选失败，请检查参数');
        }
      } catch (error) {
        console.error('筛选题目时发生错误:', error);
        this.$message.error('筛选题目失败，请稍后重试');
      }
    },
    resetFilter() {
      // 重置筛选表单和筛选结果
      this.filterForm = {
        title: '',
        difficulty: '',
        type: ''
      };
      this.filteredProblems = [];
      this.selectedProblems = [];
    },
    addSelectedProblems() {
      // 添加选中的题目
      const selectedRows = this.$refs.problemTable.selection;
      this.selectedProblems = selectedRows.map(row => row.id);
      // 可以在这里添加将选中题目添加到比赛的逻辑
      this.$message.success('题目添加成功');
      // 重置筛选结果和选中状态
      this.resetFilter();
    }
  }
};
</script>

<style scoped>
.filter-add-problem {
  background-color: #fff;
}

.filter-params {
  /* 筛选参数区域的样式 */
}

.problem-table {
  /* 题目表格区域的样式 */
}

.table-footer {
  margin-top: 20px;
  text-align: right;
}
</style>