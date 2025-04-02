<template>
  <div class="competition-list">
    <div class="main">
      <!-- 搜索区域 -->
      <div class="search">
        <el-input v-model="searchTitle" clearable style="width: 150px" placeholder="请输入比赛名称"></el-input>
        <el-button style="margin-left: 10px" type="warning" @click="filterContests">搜索</el-button>
        <!-- 根据用户角色判断是否显示“发起比赛”按钮 -->
        <el-button style="margin-left: 10px" type="primary" @click="showDialog = true" v-if="user.role === '教师' || user.role === 'ROLE_ADMIN' ">发起比赛</el-button>
      </div>
      <!-- 表格区域 -->
      <div class="table">
        <el-table :data="tableData">
          <el-table-column prop="contest_title" label="比赛名称" width="260">
            <!-- 自定义显示比赛名称的模板 -->
            <template v-slot="scope">
              <a href="javascript:void(0);" @click="openCompetitionDetail(scope.row.contest_id)" class="title-link">{{ scope.row.contest_title }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="start_time" label="开始时间" width="150"></el-table-column>
          <el-table-column prop="end_time" label="结束时间" width="150"></el-table-column>
          <el-table-column prop="num" label="题数" width="80"></el-table-column>
          <!-- 带筛选功能的表格列 -->
          <el-table-column prop="state" label="状态" width="100"
           :filters="[{text: '未开始', value: '未开始'}, {text: '进行中', value: '进行中'}, {text: '已结束', value: '已结束'}]"
           :filter-method="filterHandler"></el-table-column>
          <el-table-column prop="holder_name" label="举办者" width="100"></el-table-column>
          <!-- 自定义显示榜单链接的模板 -->
          <el-table-column fixed="right" prop="rank" label="榜单">
            <template v-slot="scope">
              <a :href="'/competition/' + scope.row.contest_id + '/rank'" target="_blank" class="rank-link">查看</a>
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
      <!-- 添加选择发起比赛方式的对话框 -->
      <el-dialog
          title="选择发起比赛方式"
          :visible.sync="showDialog"
          width="30%">
        <el-form>
          <el-form-item>
            <el-radio-group v-model="competitionType">
              <el-radio label="手动创建比赛" style="display: block; margin-bottom: 20px; color: black;" class="el-radio-text1"></el-radio>
              <el-radio label="自动随机组题" style="display: block; color: black;" class="el-radio-text2"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="showDialog = false" round>取 消</el-button>
          <el-button type="primary" @click="startCompetition" round>下一步</el-button>
        </span>
      </el-dialog>
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
      params: {},
      total: '',
      searchTitle: '',
      showDialog: false,
      competitionType: '',
    }
  },
  async mounted() {
    // 组件挂载时自动调用获取比赛列表功能
    await this.filterContests();

    // 获取所有比赛的题目数量
    const promises = this.tableData.map(contest => this.getProblemCount(contest.contest_id).then(count => ({ contestId: contest.contest_id, count })));
    const results = await Promise.all(promises);

    // 更新表格数据中的题目数量
    results.forEach(result => {
      const contest = this.tableData.find(c => c.contest_id === result.contestId);
      if (contest) {
        this.$set(contest, 'num', result.count);
      }
    });
  },
  methods: {
    startCompetition() {
      this.showDialog = false;
      if (this.competitionType === '手动创建比赛') {
        this.$router.push('/new-competition-page'); // 导航到手动创建比赛页面
      } else if (this.competitionType === '自动随机组题') {
        this.$router.push('/new-competition-page-auto'); // 导航到自动随机组题页面
      }
    },
    // 自定义筛选方法
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    openCompetitionDetail(competitionId) {
      const url = `/competition/${competitionId}`;
      window.open(url, '_blank');
    },
    async filterContests() {
      try {
        // 配置请求体，包含搜索关键词
        const requestBody = {
          title: this.searchTitle,
          // 如果需要，可以添加其他过滤参数，如holder_name
        };
        // 发送POST请求到过滤接口
        const response = await newRequest.post('/api/contest/filter', requestBody);
        console.log('过滤后的比赛列表:', response);
        // 更新表格数据
        this.tableData = response;

        // 如果需要，可以更新总条数或其他状态
        this.total = response.length; // 假设响应中包含总条数信息

        // 获取当前时间
        const now = new Date();

        // 遍历比赛列表，为每个比赛添加状态
        this.tableData = response.map(contest => {
          const startTime = new Date(contest.start_time); // 假设start_time是ISO格式的字符串
          const endTime = new Date(contest.end_time); // 假设end_time是ISO格式的字符串

          // 判断状态
          let state;
          if (now < startTime) {
            state = '未开始';
          } else if (now >= startTime && now <= endTime) {
            state = '进行中';
          } else {
            state = '已结束';
          }

          // 添加状态到比赛对象
          return { ...contest, state };
        });

      } catch (error) {
        console.error('过滤比赛失败:', error);
        // 可以添加用户提示，例如使用Element UI的消息提示组件
        this.$message.error('过滤比赛失败，请稍后重试');
      }
    },
    async getProblemCount(contestId) {
      try {
        // 使用newRequest而不是axios来发送请求
        const response = await newRequest.get(`/api/contest/getinfo/${contestId}`);

        // 假设响应数据中包含problem_ids字段，它是一个数组
        const problemIds = response.problem_ids; // 注意这里应该是response.data.problem_ids，但根据newRequest的response拦截器配置，它直接返回了response.data

        // 返回题目数量
        return problemIds.length;
      } catch (error) {
        console.error('获取题目数量失败:', error);
        // 处理错误，例如显示提示信息
        this.$message.error('获取题目数量失败，请稍后重试');
        return 0; // 或者根据需要返回其他值
      }
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

.el-radio-text1::after {
  content: '（手动编辑创建新比赛）';
  display: block;
  margin: 10px 24px;
  font-size: 12px;
  font-weight: lighter;
}
.el-radio-text2::after {
  content: '（系统从已有题库中随机选题）';
  display: block;
  margin: 10px 24px;
  font-size: 12px;
  font-weight: lighter;
}
</style>
