// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//  导入全局样式
import '@/assets/index.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//  导入axios
import axios from 'axios'

//  配置公共路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'

//  请求拦截器
axios.interceptors.request.use(
  function(config) {
    //  在请求发送之前调用
    if (!config.url.endsWith('/login')) {
      config.headers.Authorization = localStorage.getItem('token')
    }
    return config
  }
)

//  响应拦截器
axios.interceptors.response.use(
  function(response) {
    //  在获取到响应数据时调用
    if (response.data.meta.status === 401) {
      router.push('/login')
      localStorage.removeItem('token')
    }
    return response
  }
)

//  将axios添加到Vue的原型中
//  Vue的实例对象可以直接使用原型对象中的属性和方法
//  所有的组件都是Vue的实例
//  只要是像axios这样的第三方库(与Vue没有任何关系),都应该通过这种方式来统一导入
Vue.prototype.$http = axios

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
