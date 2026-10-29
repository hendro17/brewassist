import './style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Step1 from './pages/Step1.vue'
import Step2 from './pages/Step2.vue'
import Step3 from './pages/Step3.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/s1' },
    { path: '/s1', component: Step1 },
    { path: '/s2', component: Step2 },
    { path: '/s3', component: Step3 },
  ],
})
createApp(App).use(createPinia()).use(router).mount('#app')
