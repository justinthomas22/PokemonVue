<template>
  <div class="create-deck">
    <h2>Créer un deck</h2>
    <NForm @submit.prevent="handleSubmit">
      <NFormItem label="Nom du deck" required>
        <NInput v-model:value="name" placeholder="Nom du deck" />
      </NFormItem>
      <div class="deck-cards-section">
        <div class="deck-cards-header">
          <NText>Cartes sélectionnées : {{ selectedIds.length }} / 10</NText>
        </div>

        <NFormItem label="Rechercher une carte">
          <NInput
            v-model:value="searchQuery"
            clearable
            placeholder="Nom de la carte"
          />
        </NFormItem>

        <CardGrid
          :cards="filteredCards"
          :selected-ids="selectedIds"
          :max-select="10"
          @update:selected-ids="selectedIds = $event"
        />
      </div>
      <NButton
        type="primary"
        attr-type="submit"
        :disabled="name.trim() === '' || selectedIds.length !== 10 || loading"
        class="create-btn"
      >
        Créer
      </NButton>

      <NAlert v-if="error" type="error">
        {{ error }}
      </NAlert>
    </NForm>
  </div>
</template>

<script setup lang="ts">
import { NText } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import CardGrid from '../components/CardGrid.vue'
import { useApi } from '../composables/useApi'
import type { Card } from '../types/card'

const name = ref('')
const cards = ref<Card[]>([])
const selectedIds = ref<number[]>([])
const searchQuery = ref('')
const loading = ref(false)
const error = ref('')
const api = useApi()
const router = useRouter()

const filteredCards = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) return cards.value

  return cards.value.filter((card) => card.name.toLowerCase().includes(query))
})

onMounted(async () => {
  const allCards = await api.getCards()

  cards.value = (allCards as Card[]).map((c) => ({
    ...c,
    id: Number(c.id),
  }))
})

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    await api.createDeck({
      name: name.value,
      cards: selectedIds.value,
    })

    router.push('/')
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Erreur lors de la création'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-deck {
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
.create-btn {
  width: 100%;
  margin-top: 16px;
}
</style>
