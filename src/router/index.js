import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('views/Login.vue')
const Home = () => import('views/Home.vue')
const Welcome = () => import('components/welcome/Welcome.vue')
const User = () => import('components/user/User.vue')
const Roles = () => import('components/rights/Roles.vue')
const Rights = () => import('components/rights/Rights.vue')
const Goods = () => import('components/goods/Goods.vue')
const Params = () => import('components/goods/Params.vue')
const Categories = () => import('components/goods/Categories.vue')
const Orders = () => import('components/orders/Orders.vue')
const Reports = () => import('components/reports/Reports.vue')

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
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Reports
      }
    ]
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
