import { createApp } from 'vue'
//import './style.css'
//import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import LoginView from './view/LoginView.vue'

const app = createApp(LoginView)
app.use(ElementPlus)
app.mount('#app')