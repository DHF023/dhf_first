<template>
  <div class="competition-users">
    <div style="width: 100%; margin-bottom: 10px;">
      <el-button type="primary" @click="showAddUserDialog">新增用户</el-button>
      <el-button type="danger" @click="deleteSelectedUsers" :disabled="selectedUsers.length === 0">删除用户</el-button>
    </div>
    <div style="width: 100%">
      <el-table :data="userList" border height="350" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="user_id" label="用户ID" width="100"></el-table-column>
        <el-table-column prop="user_name" label="用户名"></el-table-column>
      </el-table>
    </div>

    <el-dialog title="新增用户" :visible.sync="addUserDialogVisible">
      <el-form :model="newUser">
        <el-form-item label="用户ID" :label-width="formLabelWidth">
          <el-input v-model="newUser.user_id" autocomplete="off" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addUser">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import newRequest from '@/utils/newRequest';
import request from "@/utils/request";

export default {
  name: 'CompetitionUsers',
  props: {
    contestId: {
      type: [String, Number],
      required: true // 比赛ID，必传属性
    },
    initialUserList: {
      type: Array,
      default: () => [] // 初始用户列表，默认为空数组
    }
  },
  data() {
    return {
      userList: [...this.initialUserList], // 用户列表，初始化为传入的initialUserList
      addUserDialogVisible: false, // 新增用户对话框的显示状态
      newUser: {
        user_id: '' // 新增用户的用户ID
      },
      selectedUsers: [], // 选中的用户列表
      formLabelWidth: '120px' // 表单标签宽度
    };
  },
  methods: {
    showAddUserDialog() {
      // 显示新增用户对话框，并清空输入框
      this.addUserDialogVisible = true;
      this.newUser.user_id = '';
    },
    async addUser() {
      // 新增用户
      if (!this.newUser.user_id) {
        this.$message.error('用户ID不能为空');
        return;
      }
      const existingUser = this.userList.find(user => user.user_id === this.newUser.user_id);
      if (existingUser) {
        this.$message.error('该用户已存在');
        return;
      }
      const userName = await this.fetchUserName(this.newUser.user_id);
      if (userName === null) {
        this.$message.error('无法获取用户名');
        return;
      }
      this.userList.push({
        user_id: this.newUser.user_id,
        user_name: userName
      });
      this.addUserDialogVisible = false;
      this.$message.success('用户添加成功');
      this.$emit('update-user-list', this.userList); // 发射事件，更新父组件的用户列表
    },
    deleteSelectedUsers() {
      // 删除选中的用户
      this.selectedUsers.forEach(user => {
        const index = this.userList.findIndex(item => item.user_id === user.user_id);
        if (index !== -1) {
          this.userList.splice(index, 1);
        }
      });
      this.selectedUsers = [];
      this.$message.success('用户删除成功');
      this.$emit('update-user-list', this.userList); // 发射事件，更新父组件的用户列表
    },
    handleSelectionChange(val) {
      // 处理用户选择变化，更新选中的用户列表
      this.selectedUsers = val;
    },
    async fetchContestUsers() {
      // 获取比赛用户列表
      try {
        const response = await newRequest.get(`/api/contest/get_all_user/${this.contestId}`);
        const userIds = response;
        const userPromises = userIds.map(async userId => {
          try {
            const usernameResponse = await request.get(`/user/${userId}/username`);
            return {
              user_id: userId,
              user_name: usernameResponse.data
            };
          } catch (error) {
            console.error(`Failed to fetch username for user ID ${userId}:`, error);
            return {
              user_id: userId,
              user_name: '未知'
            };
          }
        });
        this.userList = await Promise.all(userPromises);
        this.$emit('update-user-list', this.userList); // 发射事件，更新父组件的用户列表
      } catch (error) {
        console.error('Failed to fetch contest users:', error);
      }
    },
    async fetchUserName(userId) {
      // 根据用户ID获取用户名
      try {
        const response = await request.get(`/user/${userId}/username`);
        return response.data;
      } catch (error) {
        console.error(`Failed to fetch username for user ID ${userId}:`, error);
        return null;
      }
    }
  },
  mounted() {
    // 组件挂载时获取比赛用户列表
    this.fetchContestUsers();
  },
  watch: {
    initialUserList(newVal) {
      // 监听initialUserList的变化，更新userList
      this.userList = [...newVal];
    }
  }
};
</script>

<style scoped>
.competition-users {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dialog-footer {
  text-align: right;
}
</style>
