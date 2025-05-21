<template>
  <div class="examination">
    <div class="main">
      <div class="toolbar" v-if="isTeacherOrAdmin">
        <el-button class="new-examination-btn" round @click="openNewExaminationPage">
          <span class="new-examination-text">新建考试</span>
        </el-button>
      </div>
      <el-divider class="divider"></el-divider>

      <div style="display: flex; justify-content: center;">
        <div class="examination-list">
          <template v-if="examinationList && examinationList.length > 0">
            <el-table
              :data="examinationList"
              style="width: 100%"
              border
              height="400"
              v-loading="loading"
              element-loading-text="加载中..."
              element-loading-spinner="el-icon-loading"
            >
              <el-table-column prop="title" label="考试标题" width="180"></el-table-column>
              <el-table-column prop="description" label="考试描述"></el-table-column>
              <el-table-column prop="startTime" label="开始时间" width="180"></el-table-column>
              <el-table-column prop="endTime" label="结束时间" width="180"></el-table-column>
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <el-button @click="viewExamination(scope.row.id)" type="text">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>

          <div v-if="!loading && (!examinationList || examinationList.length === 0)" class="empty-tip">
            <el-empty description="暂无考试数据"></el-empty>
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
  FILTER_EXAMINATIONS: '/api/homework/filter',
  GET_EXAMINATION_DETAIL: '/api/homework/show',
  SUBMIT_EXAMINATION: '/api/homework/submit'
}

// 角色常量
const ROLES = {
  TEACHER: 'ROLE_TEACHER',
  ADMIN: 'ROLE_ADMIN'
}

export default {
  name: 'Examination',
  created() {
    this.fetchExaminations = debounce(this._fetchExaminations, 300)
    this.fetchExaminations()
  },

  computed: {
    isTeacherOrAdmin() {
      return this.user.role === ROLES.TEACHER || this.user.role === ROLES.ADMIN
    }
  },

  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      examinationList: [],
      loading: false,
      error: null,
      searchTitle: '',
      currentExamination: null,
      showExaminationDialog: false,
      isStudentSubmitted: false
    };
  },
  methods: {
    openNewExaminationPage() {
      window.open(this.$router.resolve({ name: 'NewExaminationPage' }).href, '_blank');
    },
    async _fetchExaminations() {
      this.loading = true
      this.error = null
      try {
        const params = {
          title: this.searchTitle,
          holder_name: this.user?.name || ''
        }
        const res = await this.$_apiRequest(API_ENDPOINTS.FILTER_EXAMINATIONS, 'post', params)
        this.examinationList = res.data
      } catch (error) {
        this.error = this.$_handleError(error, '获取考试列表失败')
        this.examinationList = []
      } finally {
        this.loading = false
      }
    },
    async viewExamination(id) {
      try {
        const res = await this.$_apiRequest(`${API_ENDPOINTS.GET_EXAMINATION_DETAIL}/${id}`)
        this.currentExamination = res.data
        this.showExaminationDialog = true
        this.isStudentSubmitted = res.data.student_record !== null
      } catch (error) {
        this.$_handleError(error, '获取考试详情失败')
      }
    },
    async submitExamination() {
      try {
        const answerList = Object.keys(this.answers).map(questionId => ({
          question_id: parseInt(questionId),
          answer: this.answers[questionId]
        }))
        const res = await this.$_apiRequest(
          `${API_ENDPOINTS.SUBMIT_EXAMINATION}/${this.currentExamination.id}`,
          'post',
          { answer_list: answerList }
        )
        if (res.data.success) {
          this.$message.success('考试提交成功')
          this.isStudentSubmitted = true
          this.viewExamination(this.currentExamination.id)
        }
      } catch (error) {
        this.$_handleError(error, '考试提交失败')
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
.examination {
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

.new-examination-btn {
  background-color: #829aff;
  border: #829aff 1px solid;
  margin-left: 30px;
  width: 104px;
  height: 36px;
}
.new-examination-btn:hover {
  background-color: #6b85e9;
}
.new-examination-btn:focus {
  background-color: #6b85e9;
}

.new-examination-text {
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

.examination-repository-btn {
  border: #829aff 1px solid;
  width: 90px;
  height: 36px;
  margin-left: 30px;
}

.examination-repository-text {
  font-size: 14px;
  color: #829aff;
}

.examination-list {
  width: 90%;
  padding-top: 20px;
}
</style>