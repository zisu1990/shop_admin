import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui' 
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'//导入全局css样式
Vue.config.productionTip = false;
Vue.use(ElementUI)


import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

// 安装axios请求
import axios from 'axios'
axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/'


axios.interceptors.request.use(config =>{
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')  //为请求头对象，添加token验证的Authorization字段
  return config;
})








Vue.prototype.$http = axios;


import { Message } from 'element-ui'
Vue.prototype.$message = Message  //提示弹框


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
