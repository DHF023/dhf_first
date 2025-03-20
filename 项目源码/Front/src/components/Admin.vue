<template>
  <div class="admin">
    <div class="main">
      <!-- 搜索区域 -->
      <div class="search">
        <!-- 学工号输入框 -->
        <el-input v-model="params.student_id" clearable style="width: 130px" placeholder="请输入学工号"></el-input>
        <!-- 用户名输入框 -->
        <el-input v-model="params.name" clearable style="width: 130px; margin-left: 10px" placeholder="请输入用户名"></el-input>
        <!-- 身份选择框 -->
        <el-select v-model="params.role" clearable style="width: 115px; margin-left: 10px" placeholder="请选择身份">
          <el-option label="教师" value="教师"></el-option>
          <el-option label="学生" value="学生"></el-option>
        </el-select>
        <!-- 搜索按钮 -->
        <el-button style="margin-left: 10px" type="warning" @click="findBySearch()">搜索</el-button>
        <!-- 新增按钮 -->
        <el-button type="primary" style="margin-left: 10px" @click="add()">新增</el-button>
      </div>
      <!-- 表格区域 -->
      <div class="table">
        <el-table :data="tableData">
          <el-table-column prop="student_id" label="学工号"></el-table-column>
          <el-table-column prop="name" label="用户名"></el-table-column>
          <el-table-column prop="sex" label="性别"></el-table-column>
          <el-table-column prop="role" label="身份"></el-table-column>
          <!-- 操作列 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
              <!-- 删除确认框 -->
              <el-popconfirm title="确定删除吗？" @confirm="del(scope.row.id)">
                <el-button slot="reference" type="danger" style="margin-left: 5px">删除</el-button>
              </el-popconfirm>
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
          :total="total">
        </el-pagination>
      </div>
      <!-- 对话框区域 -->
      <div class="dialog">
        <el-dialog title="请填写信息" :visible.sync="dialogFormVisible" width="30%">
          <el-form :model="form">
            <!-- 序号输入框 -->
            <el-form-item label="序号" label-width="15%">
              <el-input v-model="form.student_id" autocomplete="off" style="width: 90%"></el-input>
            </el-form-item>
            <!-- 用户名输入框 -->
            <el-form-item label="用户名" label-width="15%">
              <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
            </el-form-item>
            <!-- 性别选择 -->
            <el-form-item label="性 别" label-width="15%">
              <el-radio v-model="form.sex" label="男">男</el-radio>
              <el-radio v-model="form.sex" label="女">女</el-radio>
            </el-form-item>
            <!-- 年龄输入框 -->
            <el-form-item label="年 龄" label-width="15%">
              <el-input v-model="form.age" autocomplete="off" style="width: 90%"></el-input>
            </el-form-item>
            <!-- 电话输入框 -->
            <el-form-item label="电 话" label-width="15%">
              <el-input v-model="form.phone" autocomplete="off" style="width: 90%"></el-input>
            </el-form-item>
            <!-- 身份选择 -->
            <el-form-item label="身 份" label-width="15%">
              <el-select v-model="form.role" placeholder="请选择" style="width: 90%">
                <el-option label="教 师" value="教师"></el-option>
                <el-option label="学 生" value="学生"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <!-- 对话框底部按钮 -->
          <div slot="footer" class="dialog-footer">
            <el-button type="warning" @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>


<script>
import request from '@/utils/request';

export default {
  name: "Admin",
  data() {
    return {
      // 搜索参数
      params: {
        student_id: '',
        name: '',
        role: '',
        pageNum: 1,
        pageSize: 10,
      },
      // 表格数据
      tableData: [],
      // 数据总数
      total: 0,
      // 对话框显示状态
      dialogFormVisible: false,
      // 表单数据
      form: {},
    }
  },
  created() {
    // 页面加载时执行搜索
    this.findBySearch();
  },
  methods: {
    // 根据搜索条件搜索数据
    findBySearch() {
      request.get("/admin/search",{
        params:this.params
      }).then (res => {
        if (res.code == '0') {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      })
    },
    // 分页大小改变时执行搜索
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize;
      this.findBySearch();
    },
    // 分页页码改变时执行搜索
    handleCurrentChange(pageNum) {
      this.params.pageNum = pageNum;
      this.findBySearch();
    },
    // 新增操作
    add() {
      this.form = {};
      this.dialogFormVisible = true;
    },
    // 编辑操作
    edit(obj) {
      this.form = obj;
      this.dialogFormVisible = true;
    },
    // 提交表单
    submit() {
      request.post("/admin", this.form).then(res => {
        if (res.code === '0') {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.dialogFormVisible = false;
          this.findBySearch();
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      })
    },
    // 删除操作
    del(id) {
      request.delete("/admin/" + id).then(res => {
        if (res.code === '0') {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.findBySearch();
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      })
    },
  }
}
</script>

<style scoped>
.admin {
  min-height: calc(100vh - 60px);
  overflow: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}

.main {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  width: 75%;
  margin-left: 190px;
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

.dialog {
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
</style>