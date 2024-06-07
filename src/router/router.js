import {createRouter, createWebHistory} from "vue-router";

import DashboardView from "../view/DashboardView.vue";
import LoginView from "../view/LoginView.vue";
import UserView from "../view/UserView.vue";

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
            ]
        },
    ]
})

export default router;