<template>
  <div class="deck-list">
    <div class="deck-list-header">
      <h2>Mes decks</h2>
      <NButton type="primary" @click="goCreate">Créer un deck</NButton>
    </div>
    <div v-if="loading" class="deck-list-loading">Chargement...</div>
    <div v-else>
      <div v-if="decks.length === 0" class="deck-list-empty">Aucun deck</div>
      <NGrid
        v-else
        responsive="screen"
        :cols="gridCols"
        :x-gap="14"
        :y-gap="14"
      >
        <NGridItem v-for="deck in decks" :key="deck.id" :span="1">
          <div class="deck-item">
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
        </NGridItem>
      </NGrid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NGrid, NGridItem, NText } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '../composables/useApi'
import type { Deck } from '../types/deck'

const decks = ref<Deck[]>([])
const loading = ref(true)
const api = useApi()
const router = useRouter()

const gridCols = computed(() => {
  if (decks.value.length <= 1) return '1'
  if (decks.value.length === 2) return '1 m:2'
  return '1 m:2 l:3'
})

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
  box-sizing: border-box;
  width: 100%;
  max-width: 1100px;
  margin: 24px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 16px;
}
.deck-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}
.deck-item {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 14px;
  border: 1px solid #eee;
  border-radius: 10px;
  background: #fcfcfc;
}
.deck-info {
  font-weight: 600;
}
.deck-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.deck-list-empty {
  text-align: center;
  color: #aaa;
  margin: 24px 0;
}

@media (min-width: 768px) {
  .deck-list {
    padding: 24px;
  }
}

@media (max-width: 767px) {
  .deck-list-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
