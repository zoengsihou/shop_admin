import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Home from '@/components/home/Home'
import Users from '@/components/users/Users'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      children: [{ path: 'users', component: Users }]
    }
  ]
})

//  全局导航守卫
//  所有的路由都会先走守卫
//  添加导航守卫后，不管访问哪个路由，都会先执行回调函数
router.beforeEach((to, from, next) => {
  // console.log('导航守卫')
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
