import { createRouter, createWebHistory } from 'vue-router'

import CreateDeckPage from './pages/CreateDeckPage.vue'
import DeckDetailPage from './pages/DeckDetailPage.vue'
import DeckEditPage from './pages/DeckEditPage.vue'
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
  { path: '/create-deck', component: CreateDeckPage },
  { path: '/deck/:id', component: DeckDetailPage },
  { path: '/deck/:id/edit', component: DeckEditPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

import { useAuthStore } from './stores/auth'

router.beforeEach((to, _from, next) => {
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
router.beforeEach((to, _from, next) => {
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
