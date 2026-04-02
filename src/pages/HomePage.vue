<template>
  <div class="home-layout">
    <div class="lobby-row">
      <div class="lobby-col">
        <Lobby mode="create" />
      </div>
      <div class="lobby-col">
        <Lobby mode="join" />
      </div>
    </div>
    <div class="decklist-row">
      <DeckList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useRouter } from 'vue-router'

import DeckList from '../components/DeckList.vue'
import Lobby from '../components/Lobby.vue'
import { useGameStore } from '../stores/game'

const router = useRouter()
const gameStore = useGameStore()
const { gameState } = storeToRefs(gameStore)

watch(gameState, (newState) => {
  if (newState) {
    router.push('/game')
  }
})
</script>

<style scoped>
.home-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  gap: 32px;
}
.lobby-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 32px;
}
.lobby-col {
  flex: 1 1 0;
  min-width: 320px;
}
.decklist-row {
  width: 100%;
}
</style>
