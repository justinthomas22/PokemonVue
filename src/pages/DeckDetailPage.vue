<template>
  <div class="deck-detail">
    <h2>Détail du deck</h2>
    <div v-if="loading">Chargement...</div>
    <div v-else>
      <div class="deck-detail-header">
        <NText class="deck-name">{{ deck?.name }}</NText>
        <NButton @click="goEdit">Modifier</NButton>
      </div>

      <CardGrid
        v-if="deck && deck.cards?.length"
        :cards="deckCards"
        size="md"
      />
      <p v-else>Aucune carte ({{ deck?.cards?.length || 0 }})</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NText } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CardGrid from '../components/CardGrid.vue'
import { useApi } from '../composables/useApi'
import type { Card } from '../types/card'
import type { Deck } from '../types/deck'

const route = useRoute()
const router = useRouter()
const api = useApi()
const deck = ref<Deck | null>(null)
const allCardsRaw = ref<Card[]>([])
const loading = ref(true)

const allCards = computed(() =>
  allCardsRaw.value.map((c: Card) => ({ ...c, id: Number(c.id) })),
)

const deckCards = computed(() => {
  if (!deck.value || !deck.value.cards?.length) return []
  return deck.value.cards
    .map(
      (dc) =>
        allCards.value.find((c: Card) => c.id === dc.cardId) || {
          id: dc.cardId,
          name: 'Inconnue',
          imgUrl: '',
          hp: 0,
          attack: 0,
          type: 'Normal' as const,
          pokedexNumber: 0,
        },
    )
    .filter(Boolean) as Card[]
})

onMounted(async () => {
  const id = route.params.id as string
  try {
    // Permet de lancer 2 requêtes en même temps
    const [deckData, allCardsData] = await Promise.all([
      api.getDeck(id),
      api.getCards(),
    ])
    allCardsRaw.value = allCardsData || []
    deck.value = deckData
  } catch {
    allCardsRaw.value = []
  } finally {
    loading.value = false
  }
})

function goEdit() {
  router.push(`/deck/${route.params.id}/edit`)
}
</script>

<style scoped>
.deck-detail {
  max-width: 700px;
  margin: 32px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 24px;
}
.deck-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.deck-name {
  font-weight: 600;
  font-size: 1.2rem;
}
</style>
