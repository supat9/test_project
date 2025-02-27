import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/UserView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/product',
      name: 'product',

      component: () => import('../views/ProductView.vue'),
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('../views/OrderView.vue'),
    },
    {
      path: '/orderdetails',
      name: 'orderdetails',
      component: () => import('../views/OrderDetails.vue'),
    },

  ],
})

export default router
