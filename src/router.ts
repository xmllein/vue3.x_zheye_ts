import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import axios from './libs/http'
const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      // 首页
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue')
    },
    {
      // 登录
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
      meta: { redirectAlreadyLogin: true }
    },
    {
      // 注册
      path: '/signup',
      name: 'signup',
      component: () => import('./views/Signup.vue'),
      meta: { redirectAlreadyLogin: true }
    },
    {
      // 创建文章
      path: '/create',
      name: 'create',
      component: () => import('./views/CreatePost.vue'),
      // 必须登录
      meta: { requiredLogin: true }
    },
    {
      // 分栏详情
      path: '/column/:id',
      name: 'column',
      component: () => import('./views/ColumnDetail.vue')
    },
    {
      // 文章详情
      path: '/posts/:id',
      name: 'post',
      component: () => import('./views/PostDetail.vue')
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  /*
  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    // 是否登录
    next('/login')
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    // 是否已经登录 跳转到首页
    next('/')
  } else {
    next()
  }
  */
  // 重构 改进
  // store数据
  const { user, token } = store.state
  // 获取路由元信息
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  // 没有登录
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      // 获取当前用户信息
      store
        .dispatch('fetchCurrentUser')
        .then(() => {
          // 已经登录
          if (redirectAlreadyLogin) {
            next('/')
          } else {
            next()
          }
        })
        .catch((err) => {
          console.log(err)
          store.commit('logout')
          next('login')
        })
    } else {
      if (requiredLogin) {
        next('login')
      } else {
        next()
      }
    }
  } else {
    // 已经登录
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
