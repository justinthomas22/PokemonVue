<template>
  <div class="lobby">
    <div v-if="mode === 'create'">
      <h2>Créer une partie</h2>
      <div v-if="lobbyError" class="lobby-error">{{ lobbyError }}</div>
      <div class="lobby-section">
        <label>Choisir un deck :</label>
        <select v-model="selectedDeckId">
          <option v-for="deck in decks" :key="deck.id" :value="deck.id">
            {{ deck.name }}
          </option>
        </select>
      </div>
      <NButton
        type="primary"
        size="large"
        block
        :disabled="!selectedDeckId"
        @click="createRoomHandler"
        >Créer une room</NButton
      >
    </div>
    <div v-else-if="mode === 'join'">
      <h2>Rejoindre une partie</h2>
      <div v-if="lobbyError" class="lobby-error">{{ lobbyError }}</div>
      <div class="lobby-section">
        <label>Choisir un deck :</label>
        <select v-model="selectedDeckId">
          <option v-for="deck in decks" :key="deck.id" :value="deck.id">
            {{ deck.name }}
          </option>
        </select>
      </div>
      <h3>Rooms disponibles</h3>
      <ul class="rooms-list">
        <li v-for="room in rooms" :key="room.id">
          <span class="room-id">{{ room.id }}</span>
          <NButton
            class="lobby-btn"
            type="primary"
            size="large"
            block
            :disabled="!selectedDeckId"
            @click="joinRoomHandler(room.id)"
            >Rejoindre</NButton
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
defineOptions({ name: 'GameLobby' })
defineProps<{ mode: 'create' | 'join' }>()
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useDeckStore } from '../stores/deck'
import { useGameStore } from '../stores/game'

const gameStore = useGameStore()
const deckStore = useDeckStore()
const router = useRouter()

const selectedDeckId = ref<number | null>(null)

const { rooms, lobbyError, gameState } = storeToRefs(gameStore)
const { createRoom, joinRoom, connectSocket } = gameStore

const { decks } = storeToRefs(deckStore)
const { fetchDecks } = deckStore

onMounted(() => {
  connectSocket()
  fetchDecks()
})

watch(gameState, (newState) => {
  if (newState) {
    router.push('/game')
  }
})

function createRoomHandler() {
  if (selectedDeckId.value) createRoom(selectedDeckId.value)
}

function joinRoomHandler(roomId: string) {
  if (selectedDeckId.value) joinRoom(roomId, selectedDeckId.value)
}
</script>

<style scoped>
.lobby {
  max-width: 500px;
  margin: 0 auto 32px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.lobby-section {
  margin-bottom: 16px;
}

select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fafbfc;
  font-size: 1rem;
  margin-top: 6px;
  margin-bottom: 6px;
  transition: border 0.2s;
}
select:focus {
  outline: none;
  border-color: #409eff;
  background: #fff;
}

.lobby-btn:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
}
.lobby-error {
  color: #d32f2f;
  margin-bottom: 16px;
  font-weight: bold;
}
.rooms-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.lobby-btn {
  margin-top: 8px;
}
</style>
