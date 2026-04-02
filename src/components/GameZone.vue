<template>
  <div class="game-zone">
    <div class="zone-header">
      <span class="zone-title">{{ isOpponent ? 'Adversaire' : 'Vous' }}</span>
      <span class="zone-score">{{ board?.score ?? 0 }}/3 KO</span>
    </div>
    <div v-if="board?.active" class="active-card-wrap">
      <PokemonCard
        :card="board.active"
        size="sm"
        :current-hp="board.active.hp"
        class="active-card"
      />
    </div>
    <div v-else class="placeholder">Aucune carte active</div>
    <div v-if="!isOpponent" class="hand-slot">
      <slot name="hand"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import PokemonCard from './PokemonCard.vue'
defineProps<{ board: unknown; isOpponent: boolean }>()
</script>

<style scoped>
.game-zone {
  width: 100%;
  min-height: 280px;
  background: #f6f6f6;
  border: 1px solid #ebebeb;
  border-radius: 14px;
  margin: 0;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}
.zone-title,
.zone-score {
  font-weight: 700;
  color: #2e2e2e;
}
.zone-score {
  font-size: 0.9rem;
}
.active-card-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-height: 140px;
}
.active-card {
  margin: 0;
}
.placeholder {
  color: #b3b3b3;
  font-style: italic;
  text-align: center;
  margin: auto 0;
}
.hand-slot {
  margin-top: 12px;
}
</style>
