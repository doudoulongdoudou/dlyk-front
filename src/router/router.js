import {createRouter, createWebHistory} from "vue-router";

import DashboardView from "../view/DashboardView.vue";
import LoginView from "../view/LoginView.vue";
import UserView from "../view/UserView.vue";
import UserDetailView from "../view/UserDetailView.vue";
import ActivityView from "../view/ActivityView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            //登录页
            path: '/',
            component: (LoginView)
        },
        {
            //驾驶舱主页
            path: '/dashboard',
            component: DashboardView,
            //子路由
            children: [
                {
                    //用户管理
                    //子路由path前面不能带 '/'
                    path: 'user',
                    component: UserView
                },
                {
                    //用户详情
                    //id是动态变量,这叫动态路由
                    path: 'user/:id',
                    component: UserDetailView
                },
                {
                    //市场活动
                    path:'activity',
                    component: ActivityView
                },

            ]
        },
    ]
})

export default router;