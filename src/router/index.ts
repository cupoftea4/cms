import { createRouter, createWebHistory } from 'vue-router'
import StudentsView from '@/views/StudentsView.vue'
import AuthView from '@/views/AuthView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: StudentsView
    },
    {
      path: '/login',
      name: 'login',
      component: AuthView
    },
    {
      path: '/tasks',
      name: 'tasks',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TasksView.vue')
    },
    {
      path: '/chat',
      name: 'chats',
      component: () => import('../views/ChatView.vue')
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: () => import('../views/ChatView.vue')
    }
  ]
})

export default router;
