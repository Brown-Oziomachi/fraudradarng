<script setup>
useHead({ title: 'Sign in' })

const { login } = useAuth()
const email = ref('')
const password = ref('')
const submitting = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  submitting.value = true
  errorMsg.value = ''
  try {
    await login(email.value, password.value)
    await navigateTo('/obelisk')
  } catch (err) {
  console.error('[login] Firebase error:', err)
  errorMsg.value = `Not allowed. (${err?.code ?? 'unknown'})`
} finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="login-wrap">
    <form class="login-card" @submit.prevent="handleSubmit">
      <h1>Sign in</h1>
      <input v-model="email" type="email" placeholder="Email" required autocomplete="username" />
      <input v-model="password" type="password" placeholder="Password" required autocomplete="current-password" />
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      <button type="submit" :disabled="submitting">
        {{ submitting ? 'Signing in…' : 'Sign in' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg, #0b0d10);
}
.login-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 280px;
  padding: 28px;
  background: var(--surface, #14171a);
  border: 1px solid var(--border, #232629);
  border-radius: 12px;
}
.login-card h1 {
  font-size: 18px;
  margin: 0 0 6px;
  color: var(--text-1, #eee);
}
.login-card input {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--border, #232629);
  background: var(--bg, #0b0d10);
  color: var(--text-1, #eee);
}
.login-card button {
  padding: 9px;
  border-radius: 8px;
  border: none;
  background: var(--accent, #3fae6a);
  color: #0b0d10;
  font-weight: 600;
  cursor: pointer;
}
.login-card button:disabled { opacity: 0.6; cursor: not-allowed; }
.error { color: #d64545; font-size: 13px; margin: 0; }
</style>