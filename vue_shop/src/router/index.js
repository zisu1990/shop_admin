import Vue from "vue";
import VueRouter from "vue-router";
import Login from '../views/Login.vue';  //导入登录组件



import Home from '../views/home.vue';


import Welcome from '../views/welcome.vue';


import Users from '../views/users/users.vue';


import Roles from '../views/power/Roles';
import Rights from '../views/power/RightList';


import Goods from '../views/goods/Goods';
import Params from '../views/goods/Params';
import Categories from '../views/goods/Categories';

import Orders from '../views/orders/Orders';


import Reports from '../views/reports/Reports';
Vue.use(VueRouter);




const router = new VueRouter({
  routes:[
    {
      
      path:'/',
      redirect:'/login'//重定向地址
    },
    {
      path:'/login',
      component:Login
    },
    {
      path:'/home',
      redirect:'/welcome',//重定向地址
      component:Home,
      children:[
        {
          
          path:'/welcome',
          component:Welcome
        },
        {
          path:'/users',
          component:Users
        },
        {
          path:'/roles',
          component:Roles
        },
        {
          path:'/rights',
          component:Rights
        },
        {
          path:'/goods',
          component:Goods
        },
        {
          path:'/params',
          component:Params
        },
        {
          path:'/categories',
          component:Categories
        },
        {
          path:'/orders',
          component:Orders 
        },
        {
          path:'/reports',
          component:Reports 
        }

      ]
    }
  ]

})



// 挂载路由导航守卫
router.beforeEach((to,form,next) =>{
  //to 将要访问的路径
  // from 代表从哪个路径跳转而来
  //next是一个函数，表示放行   next('/login')  强制跳转
  if(to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})







export default router;
