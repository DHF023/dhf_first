<template>
  <!-- 作业组件的模板部分 -->
  <div class="homework">
    <div class="main">
      <div class="toolbar" v-if="isTeacherOrAdmin">
        <el-button class="new-homework-btn" round @click="openNewHomeworkPage">
          <span class="new-homework-text">新建作业</span>
        </el-button>
      </div>
      <el-divider class="divider"></el-divider>

      <div style="display: flex; justify-content: center;">
        <div class="homework-list">
          <template v-if="homeworkList.length > 0">
            <el-table
              :data="homeworkList"
              style="width: 100%"
              border
              height="400"
              v-loading="loading"
              element-loading-text="加载中..."
              element-loading-spinner="el-icon-loading"
            >
            <el-table-column prop="title" label="作业标题" width="180"></el-table-column>
            <el-table-column prop="description" label="作业描述"></el-table-column>
            <el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click="viewHomework(scope.row.id)" type="text">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          </template>

          <div v-if="!loading && homeworkList.length === 0" class="empty-tip">
            <el-empty description="暂无作业数据"></el-empty>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import newRequest from '@/utils/newRequest'
import { debounce } from 'lodash'

// API端点常量
const API_ENDPOINTS = {
  FILTER_HOMEWORKS: '/api/homework/filter',
  GET_HOMEWORK_DETAIL: '/api/homework/show',
  SUBMIT_HOMEWORK: '/api/homework/submit'
}

// 角色常量
const ROLES = {
  TEACHER: 'ROLE_TEACHER',
  ADMIN: 'ROLE_ADMIN'
}

export default {
  name: 'Homework',
  created() {
    this.fetchHomeworks = debounce(this._fetchHomeworks, 300)
  },

  computed: {
    isTeacherOrAdmin() {
      return this.user.role === ROLES.TEACHER || this.user.role === ROLES.ADMIN
    }
  },

  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      homeworkList: [],
      loading: false,
      error: null,
      searchTitle: '',
      currentHomework: null,
      showHomeworkDialog: false,
      isStudentSubmitted: false
    };
  },
  methods: {
    // 打开新建作业页面
    openNewHomeworkPage() {
      window.open(this.$router.resolve({ name: 'NewHomeworkPage' }).href, '_blank');
    },
    async _fetchHomeworks() {
      this.loading = true
      this.error = null
      try {
        const params = {
          title: this.searchTitle,
          holder_name: this.user?.name || ''
        }
        const res = await this.$_apiRequest(API_ENDPOINTS.FILTER_HOMEWORKS, 'post', params)
        this.homeworkList = res.data
      } catch (error) {
        this.error = this.$_handleError(error, '获取作业列表失败')
        this.homeworkList = []
      } finally {
        this.loading = false
      }
    },
    async viewHomework(id) {
      try {
        const res = await this.$_apiRequest(`${API_ENDPOINTS.GET_HOMEWORK_DETAIL}/${id}`)
        this.currentHomework = res.data
        this.showHomeworkDialog = true
        this.isStudentSubmitted = res.data.student_record !== null
      } catch (error) {
        this.$_handleError(error, '获取作业详情失败')
      }
    },
    async submitHomework() {
      try {
        const answerList = Object.keys(this.answers).map(questionId => ({
          question_id: parseInt(questionId),
          answer: this.answers[questionId]
        }))
        const res = await this.$_apiRequest(
          `${API_ENDPOINTS.SUBMIT_HOMEWORK}/${this.currentHomework.id}`,
          'post',
          { answer_list: answerList }
        )
        if (res.data.success) {
          this.$message.success('作业提交成功')
          this.isStudentSubmitted = true
          this.viewHomework(this.currentHomework.id)
        }
      } catch (error) {
        this.$_handleError(error, '提交作业失败')
      }
    },
    async $_apiRequest(url, method = 'get', data = null) {
      try {
        const config = { method, url }
        if (data) {
          config.data = data
        }
        const res = await newRequest(config)
        return res
      } catch (error) {
        throw error
      }
    },
    $_handleError(error, defaultMessage) {
      console.error(`${defaultMessage}:`, error)
      const message = error.response?.data?.message || error.message || defaultMessage
      this.$message.error(message)
      return message
    }
  }
}
</script>

<style scoped>
/* 作业组件的样式部分 */
.homework {
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
  margin-bottom: 60px;
}

.new-homework-btn {
  background-color: #829aff;
  border: #829aff 1px solid;
  margin-left: 30px;
  width: 104px;
  height: 36px;
}
.new-homework-btn:hover {
  background-color: #6b85e9;
}
.new-homework-btn:focus {
  background-color: #6b85e9;
}

.new-homework-text {
  color: #f1f1f1;
  font-size: 14px;
}

.toolbar {
  height: 80px;
  display: flex;
  align-items: center;
}

.divider {
  width: 100%;
  margin: 0 0;
}

.homework-repository-btn {
  border: #829aff 1px solid;
  width: 90px;
  height: 36px;
  margin-left: 30px;
}

.homework-repository-text {
  font-size: 14px;
  color: #829aff;
}

.homework-list {
  width: 90%;
  padding-top: 20px;
  min-height: 400px;
  position: relative;
}

.empty-tip {
  margin-top: 20px;
  text-align: center;
}

/* 添加动画效果 */
.el-table__body-wrapper {
  transition: opacity 0.3s ease;
}
</style>
