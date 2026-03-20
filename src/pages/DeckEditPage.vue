<template>
  <div class="edit-deck">
    <h2>Modifier le deck</h2>
    <NForm @submit.prevent="handleSubmit">
      <NFormItem label="Nom du deck" required>
        <NInput v-model:value="name" placeholder="Nom du deck" />
      </NFormItem>
      <div class="deck-cards-section">
        <div class="deck-cards-header">
          <NText>Cartes sélectionnées : {{ selectedIds.length }} / 10</NText>
        </div>
        <CardGrid
          v-model:selected-ids="selectedIds"
          :cards="cards"
          :max-select="10"
        />
      </div>
      <NButton
        type="primary"
        attr-type="submit"
        :disabled="name.trim() === '' || loading"
        class="edit-btn"
      >
        Enregistrer ({{ selectedIds.length }}/10)
      </NButton>
      <NAlert v-if="error" type="error">
        {{ error }}
      </NAlert>
    </NForm>
  </div>
</template>

<script setup lang="ts">
import { NText } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CardGrid from '../components/CardGrid.vue'
import { useApi } from '../composables/useApi'
import type { Card } from '../types/card'

const route = useRoute()
const router = useRouter()
const api = useApi()

const name = ref('')
const cards = ref<Card[]>([])
const selectedIds = ref<number[]>([])
const loading = ref(false)
const error = ref('')

async function loadData() {
  const allCardsRes = api.getCards()
  const deckRes = api.getDeck(route.params.id as string)
  const [allCards, deck] = await Promise.all([allCardsRes, deckRes])

  cards.value = (allCards as Card[]).map((c) => ({
    ...c,
    id: Number(c.id),
  }))

  name.value = deck.name
  selectedIds.value = (deck.cards as { cardId: number }[]).map((c) =>
    Number(c.cardId),
  )
}

onMounted(() => {
  loadData()
})

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    await api.updateDeck(route.params.id as string, {
      name: name.value,
      cards: selectedIds.value,
    })
    router.push(`/deck/${route.params.id}`)
  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = e.message
    } else {
      error.value = 'Erreur pendant la modification'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.edit-deck {
  max-width: 700px;
  margin: 32px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 24px;
}
.deck-cards-section {
  margin: 24px 0;
}
.deck-cards-header {
  font-weight: 600;
  margin-bottom: 8px;
}
.edit-btn {
  width: 100%;
  margin-top: 16px;
}
</style>
