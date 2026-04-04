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

            <div class="deck-cards-preview">
              <div
                v-for="cardData in getDeckCards(deck)"
                :key="cardData.id"
                class="card-preview-item"
              >
                <img
                  :src="cardData.card.imgUrl"
                  :alt="cardData.card.name"
                  class="card-image"
                />
                <div class="card-number">
                  #{{ cardData.card.pokedexNumber }}
                </div>
                <div class="card-name">{{ cardData.card.name }}</div>
                <div class="card-type-badge" :data-type="cardData.card.type">
                  {{ cardData.card.type }}
                </div>
                <div class="card-stats">
                  <span class="stat hp"
                    ><span class="stat-icon">❤️</span>
                    {{ cardData.card.hp }}</span
                  >
                  <span class="stat attack"
                    ><span class="stat-icon">⚡</span>
                    {{ cardData.card.attack }}</span
                  >
                </div>
              </div>
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
import { NButton, NGrid, NGridItem, NText } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '../composables/useApi'
import type { Card } from '../types/card'
import type { Deck } from '../types/deck'

const decks = ref<Deck[]>([])
const allCards = ref<Card[]>([])
const loading = ref(true)
const api = useApi()
const router = useRouter()

const gridCols = computed(() => {
  if (decks.value.length <= 1) return '1'
  if (decks.value.length === 2) return '1 m:2'
  return '1 m:2 l:3'
})

function getDeckCards(deck: Deck) {
  return deck.cards
    .map((deckCard) => ({
      ...deckCard,
      card: allCards.value.find((c) => c.id === deckCard.cardId),
    }))
    .filter((dc) => dc.card !== undefined)
}

async function fetchDecks() {
  loading.value = true
  const [decksData, cardsData] = await Promise.all([
    api.getMyDecks(),
    api.getCards(),
  ])
  decks.value = decksData
  allCards.value = cardsData as Card[]
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
.deck-cards-preview {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 6px;
}
.card-preview-item {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.card-preview-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}
.card-image {
  width: 100%;
  aspect-ratio: 2.5 / 3.5;
  object-fit: cover;
  border-radius: 4px;
}
.card-number {
  font-size: 0.7rem;
  color: #999;
  font-weight: 500;
}
.card-name {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  color: #2e2e2e;
  line-height: 1.2;
}
.card-type-badge {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 3px;
  color: #fff;
  background: #999;
}
.card-type-badge[data-type='Normal'] {
  background: #a8a878;
}
.card-type-badge[data-type='Fire'] {
  background: #f08030;
}
.card-type-badge[data-type='Water'] {
  background: #6890f0;
}
.card-type-badge[data-type='Electric'] {
  background: #f8d030;
  color: #333;
}
.card-type-badge[data-type='Grass'] {
  background: #78c850;
}
.card-type-badge[data-type='Ice'] {
  background: #98d8d8;
  color: #333;
}
.card-type-badge[data-type='Fighting'] {
  background: #c03028;
}
.card-type-badge[data-type='Poison'] {
  background: #a040a0;
}
.card-type-badge[data-type='Ground'] {
  background: #e0c068;
  color: #333;
}
.card-type-badge[data-type='Flying'] {
  background: #a890f0;
}
.card-type-badge[data-type='Psychic'] {
  background: #f85888;
}
.card-type-badge[data-type='Bug'] {
  background: #a8b820;
}
.card-type-badge[data-type='Rock'] {
  background: #b8a038;
}
.card-type-badge[data-type='Ghost'] {
  background: #705898;
}
.card-type-badge[data-type='Dragon'] {
  background: #7038f8;
}
.card-type-badge[data-type='Dark'] {
  background: #705848;
}
.card-type-badge[data-type='Steel'] {
  background: #b8b8d0;
  color: #333;
}
.card-type-badge[data-type='Fairy'] {
  background: #ee99ac;
  color: #333;
}
.card-stats {
  display: flex;
  gap: 6px;
  font-size: 0.65rem;
  font-weight: 600;
  width: 100%;
  justify-content: space-around;
}
.stat {
  display: flex;
  align-items: center;
  gap: 2px;
  color: #2e2e2e;
}
.stat-icon {
  font-size: 0.8rem;
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
