<template>
  <div class="action-bar">
    <div class="turn-info" :class="{ mine: isPlayerTurn }">
      <span v-if="isPlayerTurn">Votre tour</span>
      <span v-else>Tour de l'adversaire</span>
    </div>
    <div class="action-messages">
      <span>{{ realtimeMessage || 'En attente...' }}</span>
    </div>
    <div class="actions" role="group" aria-label="Actions de tour">
      <button
        :disabled="handFull || deckEmpty || !isPlayerTurn"
        @click="$emit('draw')"
      >
        Piocher
      </button>
      <button
        :disabled="!playerHasActive || !opponentHasActive || !isPlayerTurn"
        @click="$emit('attack')"
      >
        Attaquer
      </button>
      <button :disabled="!isPlayerTurn" @click="$emit('end-turn')">
        Fin de tour
      </button>
    </div>
    <div v-if="gameError" class="action-error">{{ gameError }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isPlayerTurn: boolean
  gameError?: string
  handFull: boolean
  deckEmpty: boolean
  playerHasActive: boolean
  opponentHasActive: boolean
  realtimeMessage?: string
}>()

defineEmits<{
  draw: []
  attack: []
  'end-turn': []
}>()
</script>

<style scoped>
.action-bar {
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 10px;
  padding: 8px 10px;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: 10px;
}
.turn-info {
  justify-self: start;
  font-weight: 700;
  font-size: 0.85rem;
  color: #7b7b7b;
  background: #f2f2f2;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 5px 8px;
}
.turn-info.mine {
  color: #2f8d5a;
  background: #e8f6ee;
  border-color: #c8e7d4;
}
.action-messages {
  text-align: left;
  color: #7b7b7b;
  font-style: italic;
  font-size: 0.85rem;
}
.actions {
  display: flex;
  justify-content: stretch;
  flex-wrap: wrap;
  gap: 6px;
}
.actions button {
  flex: 1 1 120px;
  padding: 6px 11px;
  border-radius: 4px;
  border: 1px solid #d8d8d8;
  background: #fff;
  color: #3f3f3f;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}
.actions button:nth-child(2) {
  background: #e23f5d;
  border-color: #d03351;
  color: #fff;
}
.actions button:nth-child(3) {
  background: #f5a623;
  border-color: #df9419;
  color: #fff;
}
.actions button:disabled {
  background: #bdbdbd !important;
  border-color: #bdbdbd !important;
  color: #fff;
  cursor: not-allowed;
}
.action-error {
  color: #d32f2f;
  grid-column: 1 / -1;
  text-align: left;
  font-size: 0.85rem;
}

@media (min-width: 768px) {
  .action-bar {
    grid-template-columns: 140px 1fr auto;
  }

  .action-messages,
  .action-error {
    text-align: center;
  }

  .actions {
    justify-content: flex-end;
    flex-wrap: nowrap;
  }

  .actions button {
    flex: 0 1 auto;
  }
}
</style>
