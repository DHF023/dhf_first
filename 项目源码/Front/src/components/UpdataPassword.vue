<template>
  <div class="updatePassword">
    <el-container class="container">
      <el-header style="height: 50px; display: flex; align-items: center;">
        <img :src="updatePasswordSvg" alt="updatePassword"/>
        <span style="font-size: 18px; margin-left: 8px;">修 改 密 码</span>
      </el-header>
      <el-divider class="divider"></el-divider>
      <el-main>
        <div style="margin-left: 30px; margin-top: 15px;">
          <el-form label-width="100px" :model="form" :rules="rules" ref="ruleForm">
            <el-form-item label="原密码" prop="password">
              <el-input v-model="form.password" show-password prefix-icon="el-icon-lock" autocomplete="off" size="large" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="form.newPassword" show-password prefix-icon="el-icon-lock" autocomplete="off" size="large" style="width: 200px;" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="new2Password">
              <el-input v-model="form.new2Password" show-password prefix-icon="el-icon-lock" autocomplete="off" size="large" style="width: 200px;" placeholder="请输入密码"></el-input>
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
import updatePasswordSvg from "@/assets/money-credit-card.svg"

export default {
  name: 'updatePassword',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.form.new2Password !== '') {
          this.$refs.ruleForm.validateField('new2Password');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认密码'));
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      form: {
        password: '',
        newPassword: '',
        new2Password: '',
      },
      updatePasswordSvg,
      rules: {
        newPassword: [
          {required: true, validator: validatePass, trigger: 'blur'}
        ],
        new2Password: [
          {required: true, validator: validatePass2, trigger: 'blur'}
        ]
      }
    };
  },
  created() {
    this.form.password = this.user.password;
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.user.password = this.form.newPassword;
          request.post("/admin", this.user).then(res => {
            if (res.code === '0') {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              localStorage.setItem("user", JSON.stringify(this.user));
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              });
            };
          })
        }
      })
    },
  }
};
</script>

<style scoped>
.updatePassword {
  position: relative;
  min-height: calc(100vh - 60px);
  margin-top: 20px;
  margin-bottom: 20px;
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
}

.divider {
  margin: 0 0;
}
</style>