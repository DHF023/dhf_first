
import Vue from 'vue';
import VueRouter from 'vue-router';

// 引入页面组件
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import ForgetPassword from "@/components/ForgetPassword";
import Layout from '@/Layout';
import Home from '@/views/Home.vue';
import Admin from '@/components/Admin.vue'
import ProblemList from '@/components/ProblemList.vue';
import Problem from "@/components/Problem";
import CompetitionList from "@/components/CompetitionList";
import Competition from "@/components/Competition";
import CompetitionProblemList from "@/components/CompetitionProblmeList";
import CompetitionRecord from "@/components/CompetitionRecord";
import CompetitionRank from "@/components/CompetitionRank";
import CompetitionUsers from "@/components/CompetitionUsers";
import CompetitionProblem from "@/components/CompetitionProblem";
import QACenter from '@/components/QACenter.vue';
import PersonalCenter from "@/components/PersonalCenter";
import UpdatePassword from "@/components/UpdataPassword";
import Homework from "@/components/Homework";
import NewHomeworkPage from "@/components/NewHomeworkPage";
import Examination from "@/components/Examination";
import NewExaminationPage from "@/components/NewExaminationPage";
import NewCompetitionPage from "@/components/NewCompetitionPage";
import EditCompetitionPage from "@/components/EditCompetitionPage";
import ManualAddProblem from '@/components/ManualAddProblem.vue';
import AutoAddProblem from '@/components/AutoAddProblem.vue';
import AddProblem from '@/components/AddProblem.vue';
import EditProblem from '@/components/EditProblem.vue';

Vue.use(VueRouter);

// 定义路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/forget-password',
    name: 'ForgetPassword',
    component: ForgetPassword
  },
  {
    path: "/",
    name: 'layout',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: '/admin',
        name: 'Admin',
        component: Admin
      },
      {
        path: '/problem-list',
        name: 'ProblemList',
        component: ProblemList
      },
      {
        path: '/competition-list',
        name: 'CompetitionList',
        component: CompetitionList
      },
      {
        path: '/competition/:id',
        name: 'Competition',
        component: Competition,
        children: [
          {
            path: 'list',
            name: 'List',
            component: CompetitionProblemList,
          },
          {
            path: 'record',
            name: 'Record',
            component: CompetitionRecord,
          },
          {
            path: 'rank',
            name: 'Rank',
            component: CompetitionRank,
          },
          {
            path: 'users',
            name: 'Users',
            component: CompetitionUsers,
          },
          {
            path: '',
            redirect: 'list',
          },
        ]
      },
      {
        path: '/competition/:contestId/competition-problem/:problemId',
        name: 'CompetitionProblem',
        component: CompetitionProblem
      },
      {
        path: '/homework-analysis',
        name: 'HomeworkAnalysis',
        component: () => import('@/components/HomeworkProgress.vue')
      },
      {
        path: '/exam-analysis',
        name: 'ExamAnalysis',
        component: () => import('@/components/ExamAnalysis.vue')
      },
      {
        path: '/practice-analysis',
        name: 'PracticeAnalysis',
        component: () => import('@/components/PracticeStatus.vue')
      },
      {
        path: '/qa-center',
        name: 'QACenter',
        component: QACenter
      },
      {
        path: '/personal-center',
        name: 'PersonalCenter',
        component: PersonalCenter
      },
      {
        path: '/update-password',
        name: 'updatePassword',
        component: UpdatePassword
      },
      {
        path: '/problem/:id',
        name: 'Problem',
        component: Problem,
      },
      {
        path: '/homework',
        name: 'Homework',
        component: Homework,
      },
      {
        path: '/new-homework-page',
        name: 'NewHomeworkPage',
        component: NewHomeworkPage,
      },
      {
        path: '/examination',
        name: 'Examination',
        component: Examination,
      },
      {
        path: '/new-examination-page',
        name: 'NewExaminationPage',
        component: NewExaminationPage,
      },
      {
        path: '/new-competition-page',
        name: 'NewCompetitionPage',
        component: NewCompetitionPage,
      },
      {
        path: '/edit-competition-page/:contestId',
        name: 'EditCompetitionPage',
        component: EditCompetitionPage,
        props: true
      },
      {
        path: '/manual-add-problem',
        name: 'ManualAddProblem',
        component: ManualAddProblem,
      },
      {
        path: '/auto-add-problem',
        name: 'AutoAddProblem',
        component: AutoAddProblem,
      },
      {
        path: '/add-problem',
        name: 'AddProblem',
        component: AddProblem,
      },
      {
        path: '/edit-problem/:problemId',
        name: 'EditProblem',
        component: EditProblem,
        props: true
      }
    ]
  },
]

// 创建路由实例
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// 路由守卫，用于权限控制
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user');
  let userRole = null;

  if (user) {
    const parsedUser = JSON.parse(user);
    userRole = parsedUser.role; // 从用户对象中获取角色
  }

  // 定义需要特定角色的路由
  const roleRequiredRoutes = {
    '/new-homework-page': ['ROLE_ADMIN', '教师'],
    '/new-examination-page': ['ROLE_ADMIN', '教师'],
    '/new-competition-page': ['ROLE_ADMIN', '教师'],
    '/edit-competition-page/:contestId': ['ROLE_ADMIN', '教师'],
    '/add-problem': ['ROLE_ADMIN', '教师'],
    '/edit-problem/:problemId': ['ROLE_ADMIN', '教师'],
  };

  // 检查用户登录状态和角色权限
  if (!user && !['/', '/login', '/register', '/forget-password'].includes(to.path)) {
    // 未登录用户尝试访问非公开页面
    Vue.prototype.$confirm('您尚未登录，无法查看该页面。是否前往登录？', '提示', {
      confirmButtonText: '前往登录',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      next('/login'); // 用户选择前往登录
    }).catch(() => {
      next(false); // 用户选择取消，留在当前页面
    });
  } else if (roleRequiredRoutes[to.path] && !roleRequiredRoutes[to.path].includes(userRole)) {
    // 用户角色不满足访问目标路由所需的角色要求
    Vue.prototype.$alert('您没有权限访问该页面。', '权限不足', {
      confirmButtonText: '确定',
      type: 'error'
    }).then(() => {
      next('/'); // 重定向到首页
    });
  } else {
    next(); // 其他情况，继续执行路由导航
  }
});

export default router;
