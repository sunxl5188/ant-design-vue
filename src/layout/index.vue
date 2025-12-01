<template>
  <a-layout class="h-screen">
    <LayoutSider />
    <a-layout>
      <LayoutHeader />
      <LayoutTabs />
      <a-layout-content
        class="p-3 overflow-auto"
        :class="[
          { 'bg-gray-100': appStore.theme === 'light' },
          { 'bg-gray-900': appStore.theme === 'dark' }
        ]"
      >
        <router-view v-slot="{ Component }" :key="appStore.refreshKey">
          <keep-alive :include="appStore.keepArray">
            <component v-if="Component" :is="Component" />
          </keep-alive>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts" name="LayoutIndex">
import LayoutHeader from './LayoutHeader.vue'
import LayoutSider from './LayoutSider.vue'
import LayoutTabs from './LayoutTabs.vue'
import { useAppStore } from '@/store/useAppStore'

const appStore = useAppStore()
</script>
