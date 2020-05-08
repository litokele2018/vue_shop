import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'
import 'assets/css/reset.css'

import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

Vue.use(VueQuillEditor, /* { default global options } */ )

Vue.config.productionTip = false
// 注册为全局可以用的组件
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')