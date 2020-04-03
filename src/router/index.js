import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/Login.vue')
const Home = () => import('../views/home/home.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  }, 
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

// 布置全局导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  let token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})


export default router
