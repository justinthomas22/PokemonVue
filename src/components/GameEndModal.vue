<template>
  <div class="game-end-modal">
    <div class="modal-content">
      <h2>Fin de la partie</h2>
      <p v-if="result === 'win'">Vous avez gagné !</p>
      <p v-else-if="result === 'lose'">Vous avez perdu.</p>
      <p v-else>Match nul.</p>
      <button @click="$emit('close')">Retour au lobby</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ result: 'win' | 'lose' | 'draw' }>()
defineEmits(['close'])
</script>

<style scoped>
.game-end-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
}
button {
  margin-top: 16px;
  padding: 8px 24px;
  border-radius: 6px;
  border: none;
  background: #1976d2;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}
</style>
