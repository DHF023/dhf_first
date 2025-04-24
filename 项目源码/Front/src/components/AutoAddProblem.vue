<template>
  <div class="auto-add-problem">
    <div class="selection-params">
      <el-form :model="selectionForm" label-width="120px">
        <el-form-item label="平均难度">
          <el-input-number v-model="selectionForm.average_difficulty" :min="1" :max="5" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="题目数量">
          <el-input-number v-model="selectionForm.problem_count" :min="1" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="平均通过率">
          <el-input-number v-model="selectionForm.average_accept_rate" :min="0" :max="1" :step="0.01"></el-input-number>
        </el-form-item>
        <el-form-item label="平均使用次数">
          <el-input-number v-model="selectionForm.average_used_times" :min="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="允许近6月用过">
          <el-switch v-model="selectionForm.allow_recent_used"></el-switch>
        </el-form-item>
        <el-form-item label="允许的题目类型">
          <el-select v-model="selectionForm.allowed_types" multiple placeholder="请选择">
            <el-option label="算法" value="算法"></el-option>
            <el-option label="图论" value="图论"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="selectProblems">智能选题</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import newRequest from '@/utils/newRequest';

export default {
  name: 'AutoAddProblem',
  data() {
    return {
      selectionForm: {
        average_difficulty: 3, // 平均难度，默认值为3
        problem_count: 5,      // 题目数量，默认值为5
        average_accept_rate: 0.6, // 平均通过率，默认值为0.6
        average_used_times: 2, // 平均使用次数，默认值为2
        allow_recent_used: false, // 是否允许近6月用过，默认值为false
        allowed_types: [] // 允许的题目类型，默认为空数组
      },
      selectedProblems: [] // 存储选中的题目ID
    };
  },
  methods: {
    async selectProblems() {
      try {
        // 发送请求进行智能选题
        const response = await newRequest.post('/api/contest/select_problems', this.selectionForm);
        if (response.selected_problems) {
          this.selectedProblems = response.selected_problems;
          this.$message.success('选题成功');
          // 通知父组件选题成功，并传递选中的题目ID列表
          this.$emit('select-problems-success', this.selectedProblems);
        } else {
          this.$message.error('选题失败，请检查参数');
        }
      } catch (error) {
        console.error('智能选题失败:', error);
        this.$message.error('智能选题失败，请稍后重试');
      }
    },
  },
};
</script>

<style scoped>
.auto-add-problem {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
}

.selection-params {
  margin-bottom: 20px;
}
</style>