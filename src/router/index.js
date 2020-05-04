import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/Login.vue')
const Home = () => import('../views/home/Home.vue')
const Welcome = () => import('../views/home/child/welcome/Welcome.vue')
const User = () => import('../views/home/child/user/User.vue')
const Roles = () => import('../views/home/child/rights/Roles.vue')
const Rights = () => import('../views/home/child/rights/Rights.vue')
const Goods = () => import('../views/home/child/goods/Goods.vue')
const Params = () => import('../views/home/child/goods/Params.vue')
const Categories = () => import('../views/home/child/goods/Categories.vue')
const Orders = () => import('../views/home/child/orders/Orders.vue')
const Reports = () => import('../views/home/child/reports/Reports.vue')

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
