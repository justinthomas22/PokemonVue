import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import { useStorage } from '@/composables/useStorage'
import type { SignUpPayload, User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const { get, set } = useStorage()
  const token = ref(get<string>('token'))
  const user = ref(get<User>('user'))
  const api = useApi()

  const isAuthenticated = computed((): boolean => {
    return !!token.value && !!user.value
  })

  const signUp = async (payload: SignUpPayload) => {
    const { username, email, password } = payload
    const response = await api.signUp({ username, email, password })
    set('token', response.token)
    set('user', response.user)
    token.value = response.token
    user.value = response.user
    return { token, user, isAuthenticated }
  }

  const login = async (email: string, password: string) => {
    const response = await api.signIn({ email, password })
    set('token', response.token)
    set('user', response.user)
    token.value = response.token
    user.value = response.user
    return { token, user, isAuthenticated }
  }

  const logout = () => {
    set('token', null)
    set('user', null)
    token.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, signUp, login, logout }
})
