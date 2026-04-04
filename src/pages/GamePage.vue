<template>
  <div class="game-page">
    <GameZone :board="opponentBoard" :is-opponent="true" />
    <ActionBar
      :is-player-turn="isPlayerTurn"
      :game-error="gameError ?? undefined"
      :hand-full="handFull"
      :deck-empty="deckEmpty"
      :player-has-active="playerHasActive"
      :opponent-has-active="opponentHasActive"
      :realtime-message="realtimeMessage"
      @draw="drawCards"
      @attack="attack"
      @end-turn="endTurn"
    />
    <GameZone :board="playerBoard" :is-opponent="false">
      <template #hand>
        <PlayerHand
          :hand="playerBoard?.hand || []"
          :deck-count="deckCount"
          :is-player-turn="isPlayerTurn"
          :player-has-active="playerHasActive"
          @play-card="playCard"
        />
      </template>
    </GameZone>
    <GameEndModal
      v-if="gameState?.result"
      :result="gameState.result"
      @close="handleGameClose"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import ActionBar from '../components/ActionBar.vue'
import GameEndModal from '../components/GameEndModal.vue'
import GameZone from '../components/GameZone.vue'
import PlayerHand from '../components/PlayerHand.vue'
import { useGameStore } from '../stores/game'

const gameStore = useGameStore()
const router = useRouter()

const {
  gameState,
  playerBoard,
  opponentBoard,
  isPlayerTurn,
  gameError,
  handFull,
  deckEmpty,
  playerHasActive,
  opponentHasActive,
  deckCount,
  realtimeMessage,
} = storeToRefs(gameStore)

const { drawCards, attack, endTurn, playCard, resetGame } = gameStore

function handleGameClose() {
  resetGame()
  router.push('/')
}
</script>

<style scoped>
.game-page {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  width: min(1220px, 100%);
  margin: 8px auto;
  padding: 8px;
  background: #fff;
  border: 1px solid #e7e7e7;
  border-radius: 14px;
}

@media (min-width: 768px) {
  .game-page {
    width: min(1220px, 96vw);
    margin: 12px auto;
    padding: 8px 10px 14px;
  }
}
</style>
