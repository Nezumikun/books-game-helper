import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Logout from './views/Logout.vue'
import store from './store'
import * as auth from './store/actions/auth'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      alias: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/password',
      name: 'password',
      component: () => import(/* webpackChunkName: "user" */ './views/Password.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if ((to.path === '/login') || (to.path === '/logout')) {
    next()
  } else {
    if (store.getters.isAuthenticated) {
      next()
    } else if (store.getters.hasToken) {
      store.dispatch(auth.AUTH_CHECK_TOKEN)
        .then(() => {
          next()
        })
        .catch(() => {
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        })
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
})

export default router
