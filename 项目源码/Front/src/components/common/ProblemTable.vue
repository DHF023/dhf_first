<template>
  <div class="problem-table-container">
    <!-- 表格主体 -->
    <el-table
      :data="problems"
      border
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <!-- 题目类型列 -->
      <el-table-column
        v-if="showType"
        prop="type"
        label="题目类型"
        width="100"
        align="center"
      >
        <template #default="{row}">
          <el-tag effect="plain" type="info">
            {{ row && row.type ? row.type : '未分类' }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 题目标题列 -->
      <el-table-column
        v-if="showTitle"
        prop="title"
        label="题目标题"
        width="180"
      >
        <template #default="{row}">
          <el-input
            v-if="row"
            v-model="row.title"
            placeholder="请输入标题"
            clearable
          />
        </template>
      </el-table-column>

      <!-- 题目描述列 -->
      <el-table-column
        v-if="showStatement"
        prop="statement"
        label="题目描述"
        width="350"
      >
        <template #default="{row}">
          <el-input
            v-if="row"
            v-model="row.statement"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="请输入题目描述"
            style="width: 100%; box-sizing: border-box; padding: 8px;"
          />
        </template>
      </el-table-column>

      <!-- 难度列 -->
      <el-table-column
        v-if="showDifficulty"
        prop="difficulty"
        label="难度"
        width="120"
        align="center"
      >
        <template #default="{row}">
          <el-rate
            v-if="row"
            v-model="row.difficulty"
            :max="5"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
          />
        </template>
      </el-table-column>

      <!-- 选项列 -->
      <el-table-column
        v-if="showOptions"
        prop="options"
        label="选项"
        width="180"
      >
        <template #default="{row}">
          <div v-if="row" class="options-container">
            <div
              v-for="(option, index) in (row.options || [])"
              :key="index"
              class="option-item"
            >
              <el-input
                v-model="row.options[index].content"
                :placeholder="`选项 ${option.key || String.fromCharCode(65 + index)}`"
                style="width: 170px; box-sizing: border-box; padding: 4px 8px;"
              >
                <template #prepend>
                  <span class="option-label">{{ option.key || String.fromCharCode(65 + index) }}.</span>
                </template>
              </el-input>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 正确答案列 -->
      <el-table-column
        v-if="showAnswer"
        prop="answer"
        label="正确答案"
        :width="showAnswer && problems.some(p => p.type === '多选题') ? '180' : '80'"
      >
        <template #default="{row}">
          <template v-if="row && row.type === '多选题'">
            <el-select
              v-model="row.answer"
              multiple
              collapse-tags
              placeholder="选择正确答案"
              style="width: 100%"
            >
              <el-option
                v-for="option in (row.options || [])"
                :key="option.key"
                :label="option.key"
                :value="option.key"
              />
            </el-select>
          </template>
          <template v-else>
            <el-input
              v-if="row"
              v-model="row.answer"
              placeholder="正确答案"
              clearable
            />
          </template>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        label="操作"
        width="90"
        fixed="right"
        align="center"
      >
        <template #default="{ $index }">
          <el-button
            size="mini"
            type="danger"
            @click="$emit('remove', $index)"
            icon="Delete"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部操作按钮 -->
    <div class="table-actions" v-if="problems.length > 0">
      <el-button
        type="primary"
        @click="$emit('submit')"
        :loading="isSubmitting"
        icon="Check"
      >确认添加</el-button>
      <el-button
        @click="$emit('clear')"
        icon="Delete"
      ><span style="color: #333">清空</span></el-button>
      <el-button
        @click="handleSaveAll"
        icon="DocumentAdd"
      ><span style="color: #333">保存修改</span></el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    problems: {
      type: Array,
      required: true,
      default: () => []
    },
    isSubmitting: {
      type: Boolean,
      default: false
    },
    showType: {
      type: Boolean,
      default: false
    },
    showTitle: {
      type: Boolean,
      default: false
    },
    showStatement: {
      type: Boolean,
      default: false
    },
    showDifficulty: {
      type: Boolean,
      default: false
    },
    showOptions: {
      type: Boolean,
      default: false
    },
    showAnswer: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 0 ? 'even-row' : 'odd-row';
    },
    handleEdit(problem) {
      this.$emit('edit', problem);
    },
    handleSaveAll() {
      this.$emit('save-all', this.problems);
    }
  }
};
</script>

<style scoped>
.problem-table-container {
  margin: 20px 0;
}

/* 表格行样式 */
::v-deep(.el-table .even-row) {
  background-color: #f8fafc;
}

::v-deep(.el-table .odd-row) {
  background-color: #fff;
}

/* 选项容器 */
.options-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option-item {
  display: flex;
  align-items: center;
}

.option-label {
  display: inline-block;
  width: 20px;
  text-align: center;
  font-weight: bold;
}

/* 底部操作按钮 */
.table-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
}


/* 响应式设计 */
@media (max-width: 768px) {
  .table-actions {
    flex-wrap: wrap;
  }

  .table-actions .el-button {
    margin-bottom: 10px;
  }
}
</style>
