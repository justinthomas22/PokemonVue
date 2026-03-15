import { createRouter, createWebHistory } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import RegisterPage from './pages/RegisterPage.vue'
import SignUpPage from './pages/SignUpPage.vue'

export const ROUTES = {
  HOME: '/',
  SIGN_UP: '/sign-up',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  { path: ROUTES.SIGN_UP, component: SignUpPage },
  { path: '/register', component: RegisterPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

import { useAuthStore } from './stores/auth'

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ path: '/register' })
  }
  if (
    (to.path === '/register' || to.path === '/sign-up') &&
    auth.isAuthenticated
  ) {
    return next({ path: '/' })
  }
  next()
})

export default router
