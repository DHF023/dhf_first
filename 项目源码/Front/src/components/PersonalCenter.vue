<template>
  <!-- 个人中心页面模板 -->
  <div class="center">
    <el-container class="container">
      <el-header style="height: 50px; display: flex; align-items: center;">
        <img :src="userSvg" alt="user"/>
        <span style="font-size: 18px; margin-left: 8px;">个 人 中 心</span>
      </el-header>
      <el-divider class="divider"></el-divider>
      <el-main>
        <div style="margin-left: 30px;">
          <el-form :model="form" label-width="100px" :rules="rules" ref="ruleForm">
            <el-form-item label="头像" prop="avatar" class="avatar">
              <el-image
                  style="width: 70px; height: 70px; border-radius: 50%; margin-left: 30px;"
                  :src="'http://localhost:8080/api/files/' + form.avatar"
                  :preview-src-list="['http://localhost:8080/api/files/' + form.avatar]">
              </el-image>
              <el-upload
                  class="upload"
                  action="http://localhost:8080/api/files/upload"
                  :show-file-list="false"
                  :on-success="successUpload">
                <el-button size="small" type="primary" class="upload-button">
                  <span>点击上传</span>
                  <i class="el-icon-upload el-icon--right"></i>
                </el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="用 户 名" prop="name">
              <el-input v-model="form.name" autocomplete="off" style="width: 200px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="性 别" prop="sex">
              <el-radio v-model="form.sex" label="男">男</el-radio>
              <el-radio v-model="form.sex" label="女">女</el-radio>
            </el-form-item>
            <el-form-item label="年 龄" prop="age">
              <el-input v-model="form.age" autocomplete="off" style="width: 200px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="身 份" prop="role">
              <el-input :value="roleDisplayText" readonly style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="form.phone" autocomplete="off" style="width: 200px;" clearable></el-input>
            </el-form-item>
            <el-form-item label="邮 箱" prop="email" style="margin-bottom: 50px;">
              <el-input v-model="form.email" autocomplete="off" style="width: 200px;" clearable></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
      <el-divider class="divider"></el-divider>
      <el-footer style="display: flex; justify-content: center; align-items: center; height: 100px;">
        <el-button class="save" type="primary" @click="save('ruleForm')">保 存</el-button>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import request from "@/utils/request";
import userSvg from "@/assets/customer-fill.svg";

// 个人中心页面脚本
export default {
  name: 'personal-center',
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}, // 当前用户信息
      form: {
        avatar: '', // 用户头像
        name: '', // 用户名
        age: '', // 用户年龄
        sex: '', // 用户性别
        phone: '', // 用户联系方式
        role: '', // 用户身份
        email: '', // 用户邮箱
      },
      roleDisplayMap: {
        'ROLE_ADMIN': '管理员',
        'ROLE_TEACHER': '教师',
        'ROLE_STUDENT': '学生'
      },
      userSvg, // 用户图标
      rules: {
        // 表单验证规则
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        role: [{ required: true, message: '请选择身份', trigger: 'change' }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
    };
  },
  created() {
    // 组件创建时初始化表单数据
    this.form.avatar = this.user.avatar;
    this.form.name = this.user.name;
    this.form.age = this.user.age;
    this.form.sex = this.user.sex;
    this.form.role = this.user.role;
    this.form.phone = this.user.phone;
    this.form.email = this.user.email;
    console.log(JSON.stringify(this.user));
  },
  computed: {
    roleDisplayText() {
      return this.roleDisplayMap[this.form.role] || this.form.role;
    }
  },
  methods: {
    // 保存表单数据
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 表单验证通过，更新用户信息并发送请求
          this.user.avatar = this.form.avatar;
          this.user.name = this.form.name;
          this.user.age = this.form.age;
          this.user.sex = this.form.sex;
          this.user.role = this.form.role;
          this.user.phone = this.form.phone;
          this.user.email = this.form.email;
          request.post("/user", this.user).then(res => {
            if (res.code === '0') {
              // 保存成功，更新本地存储并重载页面
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              localStorage.setItem("user", JSON.stringify(this.user));
              window.location.reload();
            } else {
              // 保存失败，显示错误信息
              this.$message({
                message: res.msg,
                type: 'error'
              });
            }
          });
        }
      });
    },
    // 文件上传成功回调
    successUpload(res) {
      this.form.avatar = res.data;
    }
  }
};
</script>

<style scoped>
/* 个人中心页面样式 */
.center {
  position: relative;
  min-height: calc(100vh - 60px);
  padding: 20px 0 20px 0;
  overflow: auto;
}

.container {
  background-color: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  width: 60%;
  margin-left: 290px;
}

.save {
  width: 10%;
  font-size: 16px;
  background: linear-gradient(90deg, #409EFF, #66B1FF);
  border: none;
  transition: all 0.3s ease;
}

.save:hover {
  background: linear-gradient(90deg, #66B1FF, #409EFF);
  box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.3);
}

.avatar {
  height: 80px;
}

.upload {
  position: relative;
  width: 100px;
  left: 130px;
  bottom: 60px;
}

.upload-button {
  width: 90px;
  height: 33px;
  background: linear-gradient(90deg, #409EFF, #66B1FF);
  border: none;
  transition: all 0.3s ease;
}

.upload-button:hover {
  background: linear-gradient(90deg, #66B1FF, #409EFF);
  box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.3);
}

.divider {
  margin: 0 0;
}
</style>
