<template>
  <div class="deck-list">
    <div class="deck-list-header">
      <h2>Mes decks</h2>
      <NButton type="primary" @click="goCreate">Créer un deck</NButton>
    </div>
    <div v-if="loading" class="deck-list-loading">Chargement...</div>
    <div v-else>
      <div v-if="decks.length === 0" class="deck-list-empty">Aucun deck</div>
      <div v-else>
        <div v-for="deck in decks" :key="deck.id" class="deck-item">
          <div class="deck-info">
            <NText class="deck-name" strong>{{ deck.name }}</NText>
            <NText class="deck-count">({{ deck.cards.length }} cartes)</NText>
          </div>

          <div class="deck-actions">
            <NButton size="small" @click="goDetail(deck.id)">Détail</NButton>
            <NButton size="small" @click="goEdit(deck.id)">Modifier</NButton>
            <NButton size="small" type="error" @click="deleteDeck(deck.id)"
              >Supprimer</NButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NText } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '../composables/useApi'
import type { Deck } from '../types/deck'

const decks = ref<Deck[]>([])
const loading = ref(true)
const api = useApi()
const router = useRouter()

async function fetchDecks() {
  loading.value = true
  decks.value = await api.getMyDecks()
  loading.value = false
}

onMounted(fetchDecks)

async function deleteDeck(id: number) {
  await api.deleteDeck(id)
  await fetchDecks()
}

function goCreate() {
  router.push('/create-deck')
}
function goDetail(id: number) {
  router.push(`/deck/${id}`)
}
function goEdit(id: number) {
  router.push(`/deck/${id}/edit`)
}
</script>

<style scoped>
.deck-list {
  max-width: 600px;
  margin: 32px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 24px;
}
.deck-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.deck-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}
.deck-info {
  font-weight: 600;
}
.deck-actions NButton {
  margin-left: 8px;
}
.deck-list-empty {
  text-align: center;
  color: #aaa;
  margin: 24px 0;
}
</style>
