import {createRouter, createWebHistory} from "vue-router";

import DashboardView from "../view/DashboardView.vue";
import LoginView from "../view/LoginView.vue";
import UserView from "../view/UserView.vue";
import UserDetailView from "../view/UserDetailView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: (LoginView)
        },
        {
            path: '/dashboard',
            component: DashboardView,
            //子路由
            children: [
                {
                    //子路由path前面不能带 '/'
                    path: 'user',
                    component: UserView
                },
                {
                    //id是动态变量,这叫动态路由
                    path: 'user/:id',
                    component: UserDetailView
                },

            ]
        },
    ]
})

export default router;