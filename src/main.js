import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'assets/css/reset.css'
import './assets/css/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
// 注册为全局可以用的组件
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
