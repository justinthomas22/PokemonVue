<template>
  <div class="card-grid">
    <Card
      v-for="card in cards"
      :key="card.id"
      :card="card"
      :size="size"
      :selected="selectedIds?.includes(Number(card.id)) ?? false"
      :disabled="isDisabled(Number(card.id))"
      @click="toggleSelect(card)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { Card as CardType } from '../types/card'
import Card from './Card.vue'

const props = defineProps<{
  cards: CardType[]
  selectedIds?: number[]
  maxSelect?: number
  size?: 'sm' | 'md'
}>()

const emit = defineEmits(['update:selectedIds'])

const size = computed(() => props.size ?? 'md')
const maxSelect = computed(() => props.maxSelect ?? Infinity)

function isDisabled(cardId: number) {
  const selIds = props.selectedIds ?? []
  const isSelected = selIds.includes(cardId)
  if (isSelected) return false
  return selIds.length >= maxSelect.value
}

function toggleSelect(card: CardType) {
  const selIds = props.selectedIds ?? []
  const id = Number(card.id)
  const selected = [...selIds]
  const idx = selected.indexOf(id)

  if (idx === -1) {
    if (isDisabled(id)) return
    selected.push(id)
  } else {
    selected.splice(idx, 1)
  }
  emit('update:selectedIds', selected)
}
</script>

<style scoped>
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}
</style>
