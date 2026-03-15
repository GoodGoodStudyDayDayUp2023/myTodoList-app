import { createRouter,createWebHashHistory } from "vue-router";

const router =createRouter({
  mode:'hash',
  history:createWebHashHistory(import.meta.env.BASE_URL),
  routes:[
    {
      path:"/",
      name:"默认路径",
      redirect:"/today"
    },
    {
      path:"/today",
      name:"今日待办",
      component:()=>import("@/views/Calendar.vue")
    },
    {
      path:"/calendar",
      name:"日历",
      component:()=>import("@/views/Calendar.vue")
    },
       {
      path:"/profile",
      name:"我的",
      component:()=>import("@/views/Profile.vue")
    }
  ]
})

export default router