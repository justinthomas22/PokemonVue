import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useApi } from '../composables/useApi'
import type { Deck } from '../types/deck'

export const useDeckStore = defineStore('deck', () => {
  const decks = ref<Deck[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const api = useApi()

  async function fetchDecks() {
    loading.value = true
    error.value = null
    try {
      decks.value = await api.getMyDecks()
    } catch (e: unknown) {
      error.value = e.message || 'Erreur lors du chargement des decks'
    } finally {
      loading.value = false
    }
  }

  return {
    decks,
    loading,
    error,
    fetchDecks,
  }
})
