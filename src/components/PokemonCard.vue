<template>
  <div
    class="card"
    :class="[size, { selected: props.selected, disabled: props.disabled }]"
    :data-test="props.selected ? 'selected' : ''"
    @click="handleClick"
  >
    <img :src="card.imgUrl" :alt="card.name" class="card-img" />

    <div class="card-info">
      <div class="card-header">
        <NText class="card-pokedex">#{{ card.pokedexNumber }}</NText>
        <NText class="card-name" strong>{{ card.name }}</NText>
      </div>

      <NFormItem label="Type">
        <div class="card-type" :style="{ background: typeColor }">
          {{ card.type }}
        </div>
      </NFormItem>

      <div class="card-stats">
        <NText>HP: {{ card.hp }}</NText>
        <NText>Atk: {{ card.attack }}</NText>
      </div>

      <div v-if="currentHp !== undefined" class="card-hp-bar">
        <div
          class="card-hp-bar-inner"
          :style="{ width: hpPercent + '%', background: '#27ae60' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NFormItem, NText } from 'naive-ui'
import { computed } from 'vue'

import { useColors } from '../composables/useColors'
import type { Card, PokemonType } from '../types/card'

const props = defineProps<{
  card: Card
  size?: 'sm' | 'md'
  selected?: boolean
  disabled?: boolean
  currentHp?: number
}>()

const emit = defineEmits(['click'])

const size = computed(() => props.size ?? 'md')
const disabled = computed(() => props.disabled ?? false)
const currentHp = computed(() => props.currentHp)

const typeColor = useColors().getTypeColor(props.card.type as PokemonType)

const hpPercent = computed(() => {
  if (currentHp.value === undefined) return 100
  return Math.max(0, Math.min(100, (currentHp.value / props.card.hp) * 100))
})

function handleClick() {
  if (!disabled.value) {
    emit('click', props.card)
  }
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  margin: 8px;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.card.sm {
  width: 120px;
  height: 180px;
}

.card.md {
  width: 180px;
  height: 260px;
}

.card.selected {
  border: 5px solid #39ff14 !important;
  background: #eaffd0 !important;
  box-shadow: 0 0 0 8px #39ff1433 !important;
  transform: scale(1.03);
  transition: all 0.2s ease !important;
  pointer-events: auto !important;
  z-index: 2;
  cursor: pointer !important;
}

.card:hover:not(.disabled) {
  transform: scale(1.02);
}

.card:hover.selected {
  transform: scale(1.05);
}

.card.disabled:not(.selected) {
  opacity: 0.5;
  cursor: not-allowed;
}
.card.selected {
  cursor: pointer !important;
}

.card-img {
  width: 100%;
  height: 60%;
  object-fit: contain;
  border-radius: 12px 12px 0 0;
}

.card-info {
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
}

.card-type {
  color: #fff;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.9em;
  margin: 4px 0;
  width: fit-content;
}

.card-stats {
  margin-top: 4px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
}

.card-hp-bar {
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin-top: 6px;
}

.card-hp-bar-inner {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}
</style>
