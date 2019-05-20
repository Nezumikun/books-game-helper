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
      component: () => import(/* webpackChunkName: "settings" */ './views/Password.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import(/* webpackChunkName: "users" */ './views/Users.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if ((to.path === '/login') || (to.path === '/logout')) {
    next()
  } else {
    if (store.getters.isAuthenticated) {
      if (store.getters.mustResetPassword && ((to.path !== '/password'))) {
        next({
          path: '/password'
        })
      } else {
        next()
      }
    } else if (store.getters.hasToken) {
      store.dispatch(auth.AUTH_CHECK_TOKEN)
        .then(() => {
          if (store.getters.mustResetPassword && ((to.path !== '/password'))) {
            next({
              path: '/password'
            })
          } else {
            next()
          }
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
