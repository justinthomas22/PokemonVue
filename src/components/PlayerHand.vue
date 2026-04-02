<template>
  <div class="player-hand">
    <div class="hand-header">Main ({{ hand.length }}/5)</div>
    <div class="hand-cards">
      <PokemonCard
        v-for="card in hand"
        :key="card.id"
        :card="card"
        size="sm"
        :class="{ playable: isPlayerTurn }"
        @click="playCard(card)"
      />
    </div>
    <div class="deck-count">Deck : {{ deckCount }} cartes</div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '../types/card'
import PokemonCard from './PokemonCard.vue'

const props = defineProps<{
  hand: Card[]
  deckCount: number
  isPlayerTurn: boolean
  playerHasActive: boolean
}>()
const emit = defineEmits<{
  'play-card': [cardId: number]
}>()

function playCard(card: Card) {
  if (props.isPlayerTurn && !props.playerHasActive) emit('play-card', card.id)
}
</script>

<style scoped>
.player-hand {
  width: 100%;
  background: transparent;
  border-radius: 0;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.hand-header {
  color: #5a5a5a;
  font-size: 0.88rem;
  margin-bottom: 6px;
}
.hand-cards {
  display: flex;
  gap: 10px;
  margin-bottom: 6px;
  overflow-x: auto;
  padding-bottom: 2px;
}
.deck-count {
  color: #666;
  font-size: 0.82rem;
}
.playable {
  cursor: pointer;
  border: 2px solid #67c58f;
}
</style>
