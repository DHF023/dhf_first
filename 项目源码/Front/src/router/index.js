import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import Layout from '@/Layout';
import Home from '@/views/Home.vue';
import Admin from '@/components/Admin.vue'
import ProblemList from '@/components/ProblemList.vue';
import Problem from "@/components/Problem";
import Record from "@/components/Record";
import CompetitionList from "@/components/CompetitionList";
import Competition from "@/components/Competition";
import CompetitionProblem from "@/components/CompetitionProblem";
import Rank from "@/components/Rank.vue";
import ProgressTracking from '@/components/ProgressTracking.vue';
import QACenter from '@/components/QACenter.vue';
import PersonalCenter from "@/components/PersonalCenter";
import UpdatePassword from "@/components/UpdataPassword";


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
        path: 'admin',
        name: 'Admin',
        component: Admin
      },
      {
        path: 'problem-list',
        name: 'ProblemList',
        component: ProblemList
      },
      {
        path: 'competition-list',
        name: 'CompetitionList',
        component: CompetitionList
      },
      {
        path: '/competition/:id',
        name: 'Competition',
        component: Competition,
        props: true,
      },
      {
        path: '/competition-problem/:id',
        name: 'CompetitionProblem',
        component: CompetitionProblem,
        props: true,
      },
      {
        path: '/rank/:id',
        name: 'Rank',
        component: Rank,
        props: true
      },
      {
        path: 'progress-tracking',
        name: 'ProgressTracking',
        component: ProgressTracking
      },
      {
        path: 'qa-center',
        name: 'QACenter',
        component: QACenter
      },
      {
        path: 'personal-center',
        name: 'PersonalCenter',
        component: PersonalCenter
      },
      {
        path: 'update-password',
        name: 'updatePassword',
        component: UpdatePassword
      },
      {
        path: '/problem/:id',
        name: 'Problem',
        component: Problem,
        props: true
      },
      {
        path: '/record/:id',
        name: 'Record',
        component: Record,
        props: true
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
router.beforeEach((to ,from, next) => {
  const user = localStorage.getItem("user");
  if (!user && to.path !== '/login' && to.path !== '/register') {
    return next("/login");
  }
  next();
})

export default router