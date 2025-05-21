import Vue from 'vue';
import VueRouter from 'vue-router';

// 核心组件静态导入
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import Layout from '@/Layout';
import Home from '@/views/Home.vue';

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
        path: '/user',
        name: 'User',
        component: () => import('@/components/User.vue')
      },
      {
        path: '/problem-list',
        name: 'ProblemList',
        component: () => import('@/components/ProblemList.vue')
      },
      {
        path: '/competition-list',
        name: 'CompetitionList',
        component: () => import('@/components/CompetitionList.vue')
      },
      {
        path: '/competition/:id',
        name: 'Competition',
        component: () => import('@/components/Competition.vue'),
        children: [
          {
            path: 'list',
            name: 'List',
            component: () => import('@/components/CompetitionProblmeList.vue'),
          },
          {
            path: 'record',
            name: 'Record',
            component: () => import('@/components/CompetitionRecord.vue'),
          },
          {
            path: 'rank',
            name: 'Rank',
            component: () => import('@/components/CompetitionRank.vue'),
          },
          {
            path: 'users',
            name: 'Users',
            component: () => import('@/components/CompetitionUsers.vue'),
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
        component: () => import('@/components/CompetitionProblem.vue')
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
        component: () => import('@/components/QACenter.vue')
      },
      {
        path: '/personal-center',
        name: 'PersonalCenter',
        component: () => import('@/components/PersonalCenter.vue')
      },
      {
        path: '/update-password',
        name: 'updatePassword',
        component: () => import('@/components/UpdataPassword.vue')
      },
      {
        path: '/problem/:id',
        name: 'Problem',
        component: () => import('@/components/Problem.vue'),
      },
      {
        path: '/homework',
        name: 'Homework',
        component: () => import('@/components/Homework.vue'),
      },
      {
        path: '/new-homework-page',
        name: 'NewHomeworkPage',
        component: () => import('@/components/NewHomeworkPage.vue'),
        meta: { roles: ['ROLE_ADMIN', '教师'] }
      },
      {
        path: '/examination',
        name: 'Examination',
        component: () => import('@/components/Examination.vue'),
      },
      {
        path: '/new-examination-page',
        name: 'NewExaminationPage',
        component: () => import('@/components/NewExaminationPage.vue'),
        meta: { roles: ['ROLE_ADMIN', '教师'] }
      },
      {
        path: '/new-competition-page',
        name: 'NewCompetitionPage',
        component: () => import('@/components/NewCompetitionPage.vue'),
        meta: { roles: ['ROLE_ADMIN', '教师'] }
      },
      {
        path: '/edit-competition-page/:contestId',
        name: 'EditCompetitionPage',
        component: () => import('@/components/EditCompetitionPage.vue'),
        props: true,
        meta: { roles: ['ROLE_ADMIN', '教师'] }
      },
      {
        path: '/manual-add-problem',
        name: 'ManualAddProblem',
        component: () => import('@/components/ManualAddProblem.vue'),
      },
      {
        path: '/auto-add-problem',
        name: 'AutoAddProblem',
        component: () => import('@/components/AutoAddProblem.vue'),
      },
      {
        path: '/add-problem',
        name: 'AddProblem',
        component: () => import('@/components/AddProblem.vue'),
        meta: { roles: ['ROLE_ADMIN', '教师'] }
      },
      {
        path: '/edit-problem/:problemId',
        name: 'EditProblem',
        component: () => import('@/components/EditProblem.vue'),
        props: true,
        meta: { roles: ['ROLE_ADMIN', '教师'] }
      },
      {
        path: '/courses',
        name: 'CourseList',
        component: () => import('@/components/CourseList.vue'),
      },
      {
        path: '/course/:courseId/:tabName?',
        name: 'CourseDetail',
        component: () => import('@/components/CourseDetail.vue'),
        meta: {
          roles: ['ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT'],
          requiredAuth: true
        },
        children: [
          {
            path: '',
            name: 'CourseDefault',
            component: () => import('@/components/CourseDetail.vue')
          },
          {
            path: 'home',
            name: 'CourseHome',
            component: () => import('@/components/CourseDetail.vue')
          }
        ]
      }
    ]
  },
]

// 创建路由实例
// 添加404路由
routes.push({
  path: '*',
  name: 'NotFound',
  component: () => import('@/components/NotFound.vue')
});

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// 路由守卫，用于权限控制
router.beforeEach((to, from, next) => {
  console.log(`导航从 ${from.path} 到 ${to.path}`);

  const user = localStorage.getItem('user');
  let userRole = null;

  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      userRole = parsedUser.role === '教师' ? 'ROLE_TEACHER' :
                parsedUser.role === '学生' ? 'ROLE_STUDENT' :
                parsedUser.role || parsedUser.power;
    } catch (e) {
      console.error('解析用户数据失败:', e);
    }
  }

  // 检查是否需要认证
  if (to.matched.some(record => record.meta.requiredAuth)) {
    if (!user) {
      console.log('需要登录');
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
      return;
    }

    // 检查角色权限
    if (to.meta.roles) {
      const hasPermission = to.meta.roles.includes(userRole);
      if (!hasPermission) {
        console.warn('权限不足');
        next({ path: '/' });
        return;
      }
    }
  }

  next();
});

export default router;
