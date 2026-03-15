<template>
  <div class="auth-container">
    <h2 class="auth-title">Connexion</h2>
    <NForm @submit.prevent="handleLogin">
      <NFormItem label="Email" required>
        <NInput v-model:value="email" type="text" placeholder="Email" />
      </NFormItem>
      <NFormItem label="Mot de passe" required>
        <NInput
          v-model:value="password"
          type="password"
          show-password-on="mousedown"
          placeholder="Password"
        />
      </NFormItem>
      <NButton
        type="primary"
        attr-type="submit"
        :disabled="loading"
        class="auth-btn"
      >
        Se connecter
      </NButton>
      <p>
        Pas de compte ? <RouterLink to="/sign-up">Inscrivez-vous</RouterLink>
      </p>
      <NAlert v-if="error" type="error">{{ error }}</NAlert>
    </NForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (e: unknown) {
    const err = e as unknown
    error.value =
      err &&
      typeof err === 'object' &&
      'message' in err &&
      typeof (err as unknown).message === 'string'
        ? (err as unknown).message
        : 'Identifiants incorrects'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 32px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
p {
  margin-top: 16px;
  text-align: center;
}
.auth-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
}
.auth-btn {
  width: 100%;
  background: #27ae60;
  border-radius: 6px;
  margin-top: 12px;
  font-size: 1rem;
  font-weight: 500;
}
</style>
