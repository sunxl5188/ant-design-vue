<template>
  <a-config-provider v-bind="configProvider">
    <router-view />
  </a-config-provider>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/useAppStore'
const appStore = useAppStore()

const configProvider = computed(() => {
  return {
    theme: {
      token: appStore.themeToken
    },
    locale: appStore.antdLocale,
    componentSize: 'middle',
    transformCellText: ({ text }: { text: any }): any => {
      const types = Object.prototype.toString.call(text)
      if (types === '[object Array]' && !text.length) {
        return ['--']
      }
      return text
    }
  }
})
</script>
