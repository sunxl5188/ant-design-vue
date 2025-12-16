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
        <a-spin :spinning="appStore.refreshState">
          <router-view v-slot="{ Component }">
            <keep-alive
              v-if="$route.meta?.keepAlive"
              :include="appStore.keepAliveList"
            >
              <component
                :is="Component"
                :key="appStore.refreshKey[$route.name as string] || $route.name"
              />
            </keep-alive>
            <component
              v-else
              :is="Component"
              :key="appStore.refreshKey[$route.name as string] || $route.name"
            />
          </router-view>
        </a-spin>
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
