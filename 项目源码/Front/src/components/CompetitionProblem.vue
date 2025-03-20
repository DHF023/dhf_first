<template>
  <div class="competition-problem">
    <div class="left-part" :class="{ collapsed: isSidebarCollapsed }">
      <div>
        <!--边栏收起状态-->
        <div v-if="isSidebarCollapsed === true">
          <div style="width: 100%; height: 30px;">
            <el-button class="toggle-button" @click="toggleSidebar" plain>
              <i class="el-icon-arrow-right" style="color: #4c4c4c;"></i>
            </el-button>
          </div>
          <el-divider class="divider-collapse"></el-divider>
        </div>

        <!--边栏打开状态-->
        <div v-if="isSidebarCollapsed === false">
          <div style="width: 100%; height: 30px; display: flex; align-items: center;">
            <el-button class="toggle-button" style="margin-left: 200px;" @click="toggleSidebar" plain>
              <i class="el-icon-arrow-left" style="color: #4c4c4c;"></i>
            </el-button>
          </div>
          <el-divider class="divider"></el-divider>
          <div>
            <el-table :data="competitionProblems">
              <el-table-column prop="id" label="#" width="40"></el-table-column>
              <el-table-column prop="title" label="标题">
                <template v-slot="scope">
                  <router-link :to="'/problem/' + scope.row.id" class="title-link">{{ scope.row.title }}</router-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <div class="main" :class="{ expanded: !isSidebarCollapsed, collapsed: isSidebarCollapsed }">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { competitionProblems } from "@/data/competition-problems.js";

export default {
  name: 'competition-problem',
  props: ['id'],
  data () {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      isSidebarCollapsed: false,
      competitionProblems: competitionProblems,
    }
  },
  computed: {
    problem() {
      const competitionProblems = require('@/data/competition-problems.js').competitionProblems;
      return competitionProblems.find(c => c.id === this.id);
    },
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    gotoProblem( id ) {

    }
  },
};
</script>

<style scoped>
.competition-problem {
  min-height: calc(100vh - 60px);
  overflow: auto;
  display: flex;
}

.left-part {
  position: relative;
  background-color: #ffffff;
  width: 250px;
  height: calc(100vh - 60px);
  transition: width 0.3s ease;
  overflow: hidden;
}
.left-part.collapsed {
  width: 50px;
}

.toggle-button {
  position: relative;
  border: none;
  width: 50px;
  height: 30px;
}

.divider {
  width: 96%;
  margin: 0 5px;
}

.divider-collapse {
  width: 96%;
  margin: 0 1px;
}

.title-link {
  text-decoration: none; /* 去掉下划线 */
  color: #dba800; /* 更改字体颜色，这里以绿色为例 */
}

.main {
  display: flex;
  justify-content: center;
  height: calc(100vh - 60px);
  transition: flex-basis 0.3s ease;
  overflow: auto;
}
.main.expanded {
  flex-basis: calc(100% - 250px); /* 展开时右侧区域的宽度 */
}
.main.collapsed {
  flex-basis: calc(100% - 50px); /* 收起时右侧区域的宽度 */
}
</style>