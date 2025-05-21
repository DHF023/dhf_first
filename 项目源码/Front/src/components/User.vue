<template>
  <div class="user">
    <div class="main">
      <!-- 搜索区域 -->
      <div class="search">
        <el-input
          v-model="params.work_id"
          clearable
          placeholder="请输入学工号"
          style="width: 130px"
        />
        <el-input
          v-model="params.name"
          clearable
          placeholder="请输入用户名"
          style="width: 130px; margin-left: 10px"
        />
        <el-button
          style="
            background: linear-gradient(to right, #e6a23c, #ebb563);
            border: none;
            color: white;
            font-weight: bold;
            margin-left: 10px
          "
          @click="findBySearch"
        >
          搜索
        </el-button>
        <el-button
          style="
            background: linear-gradient(to right, #409EFF, #66b1ff);
            border: none;
            color: white;
            font-weight: bold;
            margin-left: 10px
          "
          @click="add"
        >
          新增
        </el-button>
        <el-button
          style="
            background: linear-gradient(to right, #f56c6c, #f78989);
            border: none;
            color: white;
            font-weight: bold;
            margin-left: 10px
          "
          @click="batchDelete"
          :disabled="!hasSelected"
        >
          删除
        </el-button>
      </div>

      <!-- 表格区域 -->
      <div class="table">
        <el-table
          :data="tableData"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          @filter-change="handleFilterChange"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="work_id" label="学工号"></el-table-column>
          <el-table-column prop="name" label="用户名"></el-table-column>
          <el-table-column
              prop="sex"
              label="性别"
              :filters="[{ text: '男', value: '男' }, { text: '女', value: '女' }]"
              :column-key="'sex'"
          ></el-table-column>
          <el-table-column
              prop="role"
              label="身份"
              :formatter="formatRole"
              :filters="[{ text: '教师', value: 'ROLE_TEACHER' }, { text: '学生', value: 'ROLE_STUDENT' }]"
              :column-key="'role'"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                style="
                  background: linear-gradient(to right, #409EFF, #66b1ff);
                  border: none;
                  color: white;
                  font-weight: bold;
                "
                @click="edit(scope.row)"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页区域 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>

      <!-- 对话框区域 -->
      <div class="dialog">
        <el-dialog
          title="请填写信息"
          :visible.sync="dialogFormVisible"
          width="30%"
        >
          <el-form :model="form">
            <el-form-item label="学工号" label-width="15%">
              <el-input
                v-model="form.work_id"
                autocomplete="off"
                style="width: 90%"
              />
            </el-form-item>
            <el-form-item label="用户名" label-width="15%">
              <el-input
                v-model="form.name"
                autocomplete="off"
                style="width: 90%"
              />
            </el-form-item>
            <el-form-item label="性 别" label-width="15%">
              <el-radio v-model="form.sex" label="男">男</el-radio>
              <el-radio v-model="form.sex" label="女">女</el-radio>
            </el-form-item>
            <el-form-item label="年 龄" label-width="15%">
              <el-input
                v-model="form.age"
                autocomplete="off"
                style="width: 90%"
              />
            </el-form-item>
            <el-form-item label="电 话" label-width="15%">
              <el-input
                v-model="form.phone"
                autocomplete="off"
                style="width: 90%"
              />
            </el-form-item>
            <el-form-item label="身 份" label-width="15%">
              <el-select
                v-model="form.role"
                placeholder="请选择"
                style="width: 90%"
              >
                <el-option label="教 师" value="教师"></el-option>
                <el-option label="学 生" value="学生"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="warning" @click="dialogFormVisible = false">取 消</el-button>
            <el-button
              style="background:linear-gradient(to right,#409EFF,#337ecc);border:none;color:white"
              @click="submit"
            >
              确 定
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: "User",
  data() {
    return {
      params: {
        work_id: '',
        name: '',
        sex: '',
        role: '',
        pageNum: 1,
        pageSize: 10,
      },
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      form: {},
      hasSelected: false,
    };
  },
  created() {
    this.findBySearch();
  },
  methods: {
    findBySearch() {
      console.log('Search params:', this.params);

      request.get("/user/search", { params: this.params })
          .then(res => {
            if (res.code === '0') {
              this.tableData = res.data.list;
              this.total = res.data.total;
              console.log('Search response:', res.data);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(error => {
            console.error('Search request error:', error);
            this.$message.error('搜索请求失败，请检查网络或联系管理员');
          });
    },
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize;
      this.findBySearch();
    },
    handleCurrentChange(pageNum) {
      this.params.pageNum = pageNum;
      this.findBySearch();
    },
    add() {
      this.form = {};
      this.dialogFormVisible = true;
    },
    edit(obj) {
      this.form = obj;
      this.dialogFormVisible = true;
    },
    submit() {
      request.post("/user", this.form)
          .then(res => {
            if (res.code === '0') {
              this.$message.success('操作成功');
              this.dialogFormVisible = false;
              this.findBySearch();
            } else {
              this.$message.error(res.msg);
            }
          });
    },
    batchDelete() {
      const selectedRows = this.$refs.multipleTable.selection;
      if (selectedRows.length === 0) {
        this.$message.warning('请选择要删除的行');
        return;
      }

      const idsToDelete = selectedRows.map(row => row.id);

      request.delete("/user/batchDelete", { data: idsToDelete })
          .then(res => {
            if (res.code === '0') {
              this.$message.success('批量删除成功');
              this.findBySearch();
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(error => {
            this.$message.error('批量删除失败，请检查网络或联系管理员');
            console.error('批量删除错误:', error);
          });
    },
    handleSelectionChange(selection) {
      this.hasSelected = selection.length > 0;
    },
    formatRole(row, column, cellValue) {
      if (cellValue === 'ROLE_TEACHER') return '教师';
      if (cellValue === 'ROLE_STUDENT') return '学生';
      return cellValue;
    },
    handleFilterChange(filters) {
      if (filters.sex && filters.sex.length > 0) {
        this.params.sex = filters.sex[0];
      } else {
        this.params.sex = '';
      }

      if (filters.role && filters.role.length > 0) {
        this.params.role = filters.role[0];
      } else {
        this.params.role = '';
      }

      this.findBySearch();
    },
  },
  watch: {
    'params.sex': 'findBySearch',
    'params.role': 'findBySearch',
    'params.pageNum': 'findBySearch',
    'params.pageSize': 'findBySearch',
  },
};
</script>

<style scoped>
.user {
  min-height: calc(100vh - 60px);
  overflow: auto;
  padding: 20px 0;
  display: flex;
  justify-content: center;
}

.main {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  width: 65%;
}

.search {
  margin: 15px 0 0 15px;
}

.table {
  width: 100%;
  padding: 5px 10px 5px 10px;
  overflow-x: auto;
}

.block {
  margin: 10px 0 10px 15px;
}

.dialog {
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
</style>
