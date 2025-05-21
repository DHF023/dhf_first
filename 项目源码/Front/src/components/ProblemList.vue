<template>
  <!-- 题目列表组件模板 -->
  <div class="problem-list">
    <div class="main-container">
      <!-- 侧边栏 -->
      <div class="sidebar">
        <div class="card tags-card">
          <h2>热门标签</h2>
          <el-divider></el-divider>
          <div class="tag-cloud">
            <el-tag
                v-for="tag in hotTags"
                :key="tag.name"
                :type="tag.type"
                size="medium"
                class="tag-item"
                @click="filterByTag(tag.name)">
              {{ tag.name }} ({{ tag.count }})
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="main-content">
        <div class="search">
          <!-- 搜索输入框和按钮 -->
          <el-input
              v-model="searchParams.title"
              clearable
              placeholder="请输入题目名称"
              style="width: 160px; margin-left: 10px"
          />
          <el-button
              type="warning"
              style="
                margin-left: 10px;
                background: linear-gradient(135deg, #ffba00 0%, #ff9900 100%);
                border: none;
                color: white;
                box-shadow: 0 2px 6px rgba(255, 153, 0, 0.3);
                transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
              "
              @click="searchProblems"
          >
            搜索
          </el-button>
          <!-- 管理员或教师可见的添加题目和编辑题目按钮 -->
          <el-button
              v-if="isAdminOrTeacher"
              type="primary"
              style="
                margin-left: 10px;
                background: linear-gradient(135deg, #4a5ed0 0%, #4a7ed7 100%);
                border: none;
                color: white;
                box-shadow: 0 2px 6px rgba(74, 94, 208, 0.3);
                transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
              "
              @click="openAddProblemWindow"
          >
            添加题目
          </el-button>
          <el-button
              v-if="isAdminOrTeacher"
              type="primary"
              style="
                margin-left: 10px;
                background: linear-gradient(135deg, #4a5ed0 0%, #4a7ed7 100%);
                border: none;
                color: white;
                box-shadow: 0 2px 6px rgba(74, 94, 208, 0.3);
                transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
              "
              @click="toggleEditMode"
          >
            {{ isEditMode ? '退出编辑' : '编辑题目' }}
          </el-button>
        </div>
        <div class="table">
          <!-- 非编辑模式下的题目列表 -->
          <el-table
              v-if="!isEditMode"
              :data="paginatedProblems"
              v-loading="loading"
              element-loading-text="加载中..."
          >
            <template #empty>
              <el-empty description="暂无题目数据"></el-empty>
            </template>
            <el-table-column prop="state" label="状态" width="70" />
            <el-table-column prop="id" label="编号" width="100" />
            <el-table-column prop="title" label="题目名称" width="250">
              <template #default="scope">
                <a
                    href="javascript:void(0);"
                    @click="openProblemDetail(scope.row.id)"
                    class="title-link"
                >
                  {{ scope.row.title }}
                </a>
              </template>
            </el-table-column>
            <el-table-column prop="tags" label="标签">
              <template #default="scope">
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
            <el-table-column
                prop="difficulty"
                label="难度"
                width="100"
                :filters="difficultyFilters"
                :filter-method="filterDifficulty"
            >
              <template #default="scope">
                <el-tag :type="getTagType(scope.row.difficulty)">
                  {{ scope.row.difficulty }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="pass" label="通过率" width="80">
              <template #default="scope">
                {{ scope.row.pass }}%
              </template>
            </el-table-column>
          </el-table>
          <!-- 编辑模式下的题目列表，包含编辑操作 -->
          <el-table v-else :data="paginatedProblems">
            <el-table-column prop="state" label="状态" width="70" />
            <el-table-column prop="id" label="编号" width="100" />
            <el-table-column prop="title" label="题目名称" width="200">
              <template #default="scope">
                <a
                    href="javascript:void(0);"
                    @click="openProblemDetail(scope.row.id)"
                    class="title-link"
                >
                  {{ scope.row.title }}
                </a>
              </template>
            </el-table-column>
            <el-table-column prop="tags" label="标签">
              <template #default="scope">
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
            <el-table-column
                prop="difficulty"
                label="难度"
                width="100"
                :filters="difficultyFilters"
                :filter-method="filterDifficulty"
            >
              <template #default="scope">
                <el-tag :type="getTagType(scope.row.difficulty)">
                  {{ scope.row.difficulty }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="pass" label="通过率" width="80">
              <template #default="scope">
                {{ scope.row.pass }}%
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-button
                    type="text"
                    size="mini"
                    @click="editProblem(scope.row.id)"
                >
                  <span style="color: #528fff">编辑</span>
                </el-button>
                <el-button
                    type="text"
                    size="mini"
                    @click="confirmDeleteProblem(scope.row.id)"
                >
                  <span style="color: #ff4d4f">删除</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="block">
          <!-- 分页组件 -->
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination.pageNum"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import newRequest from '@/utils/newRequest';

// 题目列表组件脚本
export default {
  data() {
    return {
      problems: [], // 题目列表
      total: 0, // 题目总数
      loading: false, // 加载状态
      hotTags: [
        { name: '动态规划', count: 56, type: '' },
        { name: '树结构', count: 42, type: 'success' },
        { name: '图论', count: 38, type: 'warning' },
        { name: '字符串', count: 35, type: 'danger' },
        { name: '数组', count: 32, type: 'info' },
        { name: '排序', count: 28, type: '' },
        { name: '搜索', count: 25, type: 'success' },
        { name: '贪心算法', count: 22, type: 'warning' },
        { name: '位运算', count: 18, type: 'danger' },
        { name: '数学', count: 15, type: 'info' }
      ],
      searchParams: {
        title: '', // 搜索参数：题目名称
      },
      pagination: {
        pageNum: 1, // 当前页码
        pageSize: 10, // 每页显示条数
      },
      user: JSON.parse(localStorage.getItem('user')) || {}, // 当前用户信息
      showAddDialog: false, // 是否显示添加题目对话框
      addType: 'single', // 添加题目类型
      difficultyFilters: [
        { text: '简单', value: '简单' },
        { text: '中等', value: '中等' },
        { text: '困难', value: '困难' },
      ], // 难度过滤器
      currentProblem: null, // 当前选中的题目
      isEditMode: false, // 是否处于编辑模式
    };
  },
  computed: {
    // 判断当前用户是否为管理员或教师
    isAdminOrTeacher() {
      return this.user.role === 'ROLE_TEACHER' || this.user.role === 'ROLE_ADMIN';
    },
    // 计算当前分页的题目列表
    paginatedProblems() {
      const start = (this.pagination.pageNum - 1) * this.pagination.pageSize;
      const end = start + this.pagination.pageSize;
      return this.problems.slice(start, end);
    }
  },
  created() {
    // 组件创建时获取所有题目
    this.fetchAllProblems();
  },
  methods: {
    // 处理每页显示条数变化
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
    },
    // 处理当前页码变化
    handleCurrentChange(pageNum) {
      this.pagination.pageNum = pageNum;
    },
    // 打开题目详情页面
    openProblemDetail(problemId) {
      window.open(`/problem/${problemId}`, '_blank');
    },
    // 根据标签过滤题目
    filterByTag(tagName) {
      this.searchParams.title = '';
      this.pagination.pageNum = 1;

      // 实现标签过滤逻辑
      this.$message.success(`已筛选标签: ${tagName}`);
      // 这里可以添加实际的过滤逻辑，如API调用等
    },
    // 根据难度获取标签类型
    getTagType(difficulty) {
      const typeMap = {
        简单: 'success',
        中等: 'warning',
        困难: 'danger',
      };
      return typeMap[difficulty] || '';
    },
    // 难度过滤器方法
    filterDifficulty(value, row) {
      return row.difficulty === value;
    },
    // 搜索题目
    searchProblems() {
      if (this.pagination.pageNum > 1) {
        this.pagination.pageNum = 1;
      }
      this.fetchAllProblems();
    },
    // 获取所有题目
    fetchAllProblems() {
      this.loading = true;
      const requestBody = {
        ...this.searchParams,
      };
      newRequest.post('/api/problem/filter', requestBody)
          .then(response => {
            if (Array.isArray(response) && response.length > 0) {
              const problemIds = response;
              return this.fetchProblemDetails(problemIds);
            } else {
              this.problems = [];
              this.total = 0;
              return Promise.resolve();
            }
          })
          .then(() => {
            this.total = this.problems.length;
          })
          .catch(error => {
            console.error('获取所有题目列表失败:', error);
            this.problems = [];
            this.total = 0;
          })
          .finally(() => {
            this.loading = false;
          });
    },
    // 根据题目ID列表获取题目详情
    fetchProblemDetails(problemIds) {
      const promises = problemIds.map(problemId => {
        const requestBody = {
          problem_id: Number(problemId)
        };
        return newRequest.post('/api/problem/statement/get', requestBody)
            .then(response => {
              // 确保返回数据格式与Problem.vue一致
              return {
                ...response,
                id: problemId,
                title: response.title || '未命名题目',
                tags: response.tags || [],
                difficulty: response.difficulty || '未知',
                pass: response.pass_rate ? Math.round(response.pass_rate * 100) : 0
              };
            })
            .catch(error => {
              console.error(`获取题目ID=${problemId}的详细信息失败:`, error);
              return {
                id: problemId,
                title: '获取题目失败',
                tags: [],
                difficulty: '未知',
                pass: 0,
                state: 'error'
              };
            });
      });
      return Promise.all(promises)
          .then(responses => {
            this.problems = responses;
          })
          .catch(error => {
            console.error('获取题目详细信息时发生错误:', error);
            this.$message.error('获取题目信息失败，请稍后重试');
            this.problems = problemIds.map(id => ({
              id,
              title: '获取题目失败',
              tags: [],
              difficulty: '未知',
              pass: 0,
              state: 'error'
            }));
          });
    },
    // 打开添加题目窗口
    openAddProblemWindow() {
      window.open('/add-problem', '_blank');
    },
    // 切换编辑模式
    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
    },
    // 编辑题目
    editProblem(problemId) {
      const url = `/edit-problem/${problemId}`;
      window.open(url, '_blank');
    },

    // 确认删除题目
    confirmDeleteProblem(problemId) {
      this.$confirm('确定要删除这个题目吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteProblem(problemId);
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },

    // 删除题目
    deleteProblem(problemId) {
      this.loading = true;
      newRequest.post(`/api/questions/delete/${problemId}`)
          .then(response => {
            console.log(response);
            this.$message.success('删除成功');
            this.fetchAllProblems(); // 刷新题目列表
          })
          .catch(error => {
            console.error('删除题目失败:', error);
            if (error.response) {
              if (error.response.status === 404) {
                this.$message.error('题目不存在或已被删除');
              } else {
                this.$message.error(`删除失败: ${error.response.data.message || '服务器错误'}`);
              }
            } else {
              this.$message.error('网络错误，请检查连接后重试');
            }
          })
          .finally(() => {
            this.loading = false;
          });
    },
  },
};
</script>

<style scoped>
/* 题目列表组件样式 */
.empty-tip {
  margin-top: 60px;
  text-align: center;
}

.problem-list {
  overflow: auto;
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.main-container {
  display: flex;
  width: 80%;
  gap: 20px;
}

.sidebar {
  width: 250px;
}

.main-content {
  flex: 1;
  background-color: #fff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 15px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 15px;
  margin-bottom: 20px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 5px;
}

.tag-item:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.search {
  display: flex;
  align-items: center;
}

.table {
  width: 100%;
  margin-top: 20px;
}

.block {
  margin-top: 20px;
}

.title-link {
  text-decoration: none;
  color: #dba800;
}
</style>