<template>
  <NConfigProvider>
    <NMessageProvider>
      <NLayout>
        <HeaderBar />
        <NLayoutContent>
          <RouterView />
        </NLayoutContent>
      </NLayout>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import HeaderBar from './components/layout/HeaderBar.vue'
</script>

<style>
html,
body,
#app {
  min-height: 100%;
}

body {
  padding: 0 20px;
  overflow-y: auto;
}

.n-layout,
.n-layout-content {
  overflow: visible;
}
</style>
