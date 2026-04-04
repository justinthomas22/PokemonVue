<template>
  <NGrid responsive="screen" cols="2 m:3 l:4" :x-gap="12" :y-gap="12">
    <NGridItem v-for="card in cards" :key="card.id" class="card-grid-item">
      <Card
        :card="card"
        :size="size"
        :selected="selectedIds?.includes(Number(card.id)) ?? false"
        :disabled="isDisabled(Number(card.id))"
        @click="toggleSelect(card)"
      />
    </NGridItem>
  </NGrid>
</template>

<script setup lang="ts">
import { NGrid, NGridItem } from 'naive-ui'
import { computed } from 'vue'

import type { Card as CardType } from '../types/card'
import Card from './PokemonCard.vue'

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
.card-grid-item {
  display: flex;
  justify-content: center;
}

:deep(.card) {
  margin: 0;
}

@media (max-width: 480px) {
  :deep(.card.md) {
    width: 150px;
    height: 220px;
  }
}
</style>
