<template>
  <a-config-provider
    :theme="{
      token: appStore.themeToken
    }"
    :locale="appStore.antdLocale"
  >
    <router-view />
  </a-config-provider>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/useAppStore'
const appStore = useAppStore()
</script>
