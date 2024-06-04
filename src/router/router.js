import {createRouter, createWebHistory} from "vue-router";

import DashboardView from "../view/DashboardView.vue";
import LoginView from "../view/LoginView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: (LoginView)
        },
        {
            path: '/dashboard',
            component: (DashboardView)
        },
    ]
})

export default router;