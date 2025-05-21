<template>
  <div class="competition-list">
    <div class="main">
      <div class="search">
        <el-input v-model="searchTitle" clearable style="width: 150px" placeholder="请输入比赛名称"></el-input>
        <el-input v-model="searchHolderName" clearable style="width: 150px; margin-left: 10px;" placeholder="请输入主办方名称"></el-input>
        <el-button style="
          margin-left: 10px;
          background: linear-gradient(135deg, #ffba00 0%, #ff9900 100%);
          border: none;
          color: white;
          box-shadow: 0 2px 6px rgba(255, 153, 0, 0.3);
          transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
        " @click="filterContests">搜索</el-button>
        <el-button
            style="
              margin-left: 10px;
              background: linear-gradient(135deg, #4a5ed0 0%, #4a7ed7 100%);
              border: none;
              color: white;
              box-shadow: 0 2px 6px rgba(74, 94, 208, 0.3);
              transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
            "
            @click="navigateToNewCompetitionPage"
            v-if="user.role === 'ROLE_TEACHER' || user.role === 'ROLE_ADMIN'"
        >
          发起比赛
        </el-button>
        <el-button
            style="
              margin-left: 10px;
              background: linear-gradient(135deg, #4a5ed0 0%, #4a7ed7 100%);
              border: none;
              color: white;
              box-shadow: 0 2px 6px rgba(74, 94, 208, 0.3);
              transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
            "
            @click="toggleEditMode"
            v-if="isAdmin || isContestHolder"
        >
          {{ isEditMode ? '退出编辑' : '编辑比赛' }}
        </el-button>
      </div>
      <div class="table">
        <el-table v-if="!isEditMode" :data="paginatedData" @filter-change="filterChange" v-loading="loading" element-loading-text="加载中...">
          <template #empty>
            <div class="empty-tip">
              <el-empty description="暂无比赛数据"></el-empty>
            </div>
          </template>
          <el-table-column prop="contest_title" label="比赛名称" width="260">
            <template v-slot="scope">
              <a href="javascript:void(0);" @click="checkAndOpenCompetitionDetail(scope.row.contest_id)" class="title-link">{{ scope.row.contest_title }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="start_time" label="开始时间" width="180"></el-table-column>
          <el-table-column prop="end_time" label="结束时间" width="180"></el-table-column>
          <el-table-column prop="state" label="状态" width="70"
            :filters="[{text: '未开始', value: '未开始'}, {text: '进行中', value: '进行中'}, {text: '已结束', value: '已结束'}]"
            :column-key="'state'">
          </el-table-column>
          <el-table-column prop="holder_name" label="主办方"></el-table-column>
          <el-table-column fixed="right" prop="rank" label="榜单">
            <template v-slot="scope">
              <a href="javascript:void(0);" @click="checkAndViewRank(scope.row.contest_id)" class="rank-link">查看</a>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-else :data="paginatedData" @filter-change="filterChange" v-loading="loading" element-loading-text="加载中...">
          <template #empty>
            <div class="empty-tip">
              <el-empty description="暂无比赛数据"></el-empty>
            </div>
          </template>
          <!-- 编辑模式下的表格，包含操作列 -->
          <el-table-column prop="contest_title" label="比赛名称" width="260">
            <template v-slot="scope">
              <a href="javascript:void(0);" @click="checkAndOpenCompetitionDetail(scope.row.contest_id)" class="title-link">{{ scope.row.contest_title }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="start_time" label="开始时间" width="180"></el-table-column>
          <el-table-column prop="end_time" label="结束时间" width="180"></el-table-column>
          <el-table-column prop="state" label="状态" width="70"
            :filters="[{text: '未开始', value: '未开始'}, {text: '进行中', value: '进行中'}, {text: '已结束', value: '已结束'}]"
            :column-key="'state'">
          </el-table-column>
          <el-table-column prop="holder_name" label="主办方"></el-table-column>
          <el-table-column fixed="right" prop="rank" label="榜单">
            <template v-slot="scope">
              <a href="javascript:void(0);" @click="checkAndViewRank(scope.row.contest_id)" class="rank-link">查看</a>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="50">
            <template v-slot="scope">
              <el-button
                  v-if="isAdmin || scope.row.holder_id === user.id"
                  type="text"
                  @click="editContest(scope.row.contest_id)"
              >
                <span style="color: #528fff">编辑</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import newRequest from '@/utils/newRequest';

export default {
  name: 'competition',
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchTitle: '',
      searchHolderName: '',
      isEditMode: false,
      contestUserIds: {},
      stateFilters: [], // 新增状态筛选条件存储
      loading: false,
    }
  },
  computed: {
    isAdmin() {
      return this.user.role === 'ROLE_ADMIN';
    },
    isContestHolder() {
      return this.tableData.some(contest => contest.holder_id === this.user.id);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.tableData.slice(start, end);
    }
  },
  async mounted() {
    await this.filterContests();
  },
  methods: {
    navigateToNewCompetitionPage() {
      const url = '/new-competition-page';
      window.open(url, '_blank');
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    handleStateFilterChange(filters) {
      // 更新状态筛选条件，并重新筛选比赛数据
      this.stateFilters = filters;
      this.filterContests();
    },
    async checkAndOpenCompetitionDetail(contestId) {
      if (await this.hasPermissionToView(contestId)) {
        const url = `/competition/${contestId}`;
        window.open(url, '_blank');
      } else {
        this.$message.error('您没有权限查看');
      }
    },
    async checkAndViewRank(contestId) {
      if (await this.hasPermissionToView(contestId)) {
        const url = `/competition/${contestId}/rank`;
        window.open(url, '_blank');
      } else {
        this.$message.error('您没有权限查看');
      }
    },
    async hasPermissionToView(contestId) {
      if (this.isAdmin) {
        return true;
      }
      if (!this.contestUserIds[contestId]) {
        await this.fetchContestUserIds(contestId);
      }
      return this.contestUserIds[contestId].includes(this.user.id) || this.isHolder(contestId);
    },
    async fetchContestUserIds(contestId) {
      try {
        const response = await newRequest.get(`/api/contest/get_all_user/${contestId}`);
        this.contestUserIds[contestId] = response;
      } catch (error) {
        console.error('获取比赛用户ID列表失败:', error);
        this.$message.error('获取比赛用户ID列表失败，请稍后重试');
        this.contestUserIds[contestId] = [];
      }
    },
    async filterContests() {
      if (this.currentPage > 1) {
        this.currentPage = 1; // 可选：筛选后重置当前页为第一页
      }
      const requestBody = {
        title: this.searchTitle,
        holder_name: this.searchHolderName,
        // 注意：这里我们不再发送 states 到后端，因为后端不支持该筛选
        // states: this.stateFilters,
      };
      const response = await newRequest.post('/api/contest/filter', requestBody);

      // 计算每个比赛的状态
      let contestsWithState = response.map(contest => {
        const startTime = new Date(contest.start_time);
        const endTime = new Date(contest.end_time);
        const now = new Date();
        const state = now < startTime ? '未开始' :
            (now <= endTime ? '进行中' : '已结束');
        return { ...contest, state };
      });

      // 根据 stateFilters 筛选数据
      if (this.stateFilters.length > 0) {
        contestsWithState = contestsWithState.filter(contest => this.stateFilters.includes(contest.state));
      }

      this.tableData = contestsWithState;
      this.total = this.tableData.length;
    },
    editContest(contestId) {
      const url = `/edit-competition-page/${contestId}`;
      window.open(url, '_blank');
    },
    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
    isHolder(contestId) {
      const contest = this.tableData.find(contest => contest.contest_id === contestId);
      return contest && contest.holder_id === this.user.id;
    },
    filterChange(filters) {
      const filtersArray = filters.state || [];

      console.log('Filters changed (array):', filtersArray);

      this.stateFilters = filtersArray;
      this.filterContests();
    },
  }
}
</script>

<style scoped>
.competition-list {
  min-height: calc(100vh - 60px);
  overflow: auto;
  padding: 20px 0 20px 0;
  display: flex;
  justify-content: center;
}

.main {
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  width: 65%;
}

.search {
  margin-top: 15px;
  margin-left: 15px;
  display: flex;
  align-items: center;
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
  text-decoration: none;
  color: #dba800;
}

.rank-link {
  text-decoration: none;
  color: #528fff;
}
</style>