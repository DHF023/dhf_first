import Vue from 'vue';
import VueRouter from 'vue-router';
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
import CompetitionProblem from "@/components/CompetitionProblem";
import ProgressTracking from '@/components/ProgressTracking.vue';
import QACenter from '@/components/QACenter.vue';
import PersonalCenter from "@/components/PersonalCenter";
import UpdatePassword from "@/components/UpdataPassword";
import Homework from "@/components/Homework";
import Examination from "@/components/Examination";


Vue.use(VueRouter);

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
          // 默认重定向到题目列表
          {
            path: '',
            redirect: 'list',
          },
        ]
      },
      {
        path: '/competition-problem/:id',
        name: 'CompetitionProblemDetail',
        component: CompetitionProblem,
        props: true
      },
      {
        path: '/progress-tracking',
        name: 'ProgressTracking',
        component: ProgressTracking
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
        path: '/examination',
        name: 'Examination',
        component: Examination,
      }
    ]
  },
]

const router = new VueRouter( {
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem("user");

  // 检查用户是否已登录，以及访问的路径是否需要登录权限
  if (!user && to.path !== '/' && to.path !== '/login' && to.path !== '/register' && to.path !== '/forget-password') {
    // 如果未登录且尝试访问非公开页面（不包括忘记密码页面），则显示对话框
    Vue.prototype.$confirm('您尚未登录，无法查看该页面。是否前往登录？', '提示', {
      confirmButtonText: '前往登录',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 用户点击“前往登录”
      next('/login');
    }).catch(() => {
      // 用户点击“取消”
      next(false); // 留在当前页面或导航到首页
    });
  } else {
    // 已登录用户或访问公开页面（包括忘记密码页面），直接放行
    next();
  }
});

export default router