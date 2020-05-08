import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "Login" */ 'views/Login.vue')
const Home = () => import(/* webpackChunkName: "Home" */ 'views/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Home" */ 'components/welcome/Welcome.vue')
const User = () => import(/* webpackChunkName: "User" */ 'components/user/User.vue')
const Roles = () => import(/* webpackChunkName: "Roles" */ 'components/rights/Roles.vue')
const Rights = () => import(/* webpackChunkName: "Rights" */ 'components/rights/Rights.vue')
const Goods = () => import(/* webpackChunkName: "Goods" */ 'components/goods/Goods.vue')
const Params = () => import(/* webpackChunkName: "Params" */ 'components/goods/Params.vue')
const Categories = () => import(/* webpackChunkName: "Categories" */ 'components/goods/Categories.vue')
const Orders = () => import(/* webpackChunkName: "Order" */ 'components/orders/Orders.vue')
const Reports = () => import(/* webpackChunkName: "Reports" */ 'components/reports/Reports.vue')
const AddGoods = () => import(/* webpackChunkName: "AddGoods" */ 'components/goods/AddGoods.vue')

Vue.use(VueRouter)

const routes = [{
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
    children: [{
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
      },
      {
        path: '/addGoods',
        component: AddGoods
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