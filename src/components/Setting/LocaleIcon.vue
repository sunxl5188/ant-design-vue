<template>
  <a-dropdown trigger="click">
    <a class="ant-dropdown-link" @click.prevent>
      <GlobalOutlined class="text-base" />
    </a>
    <template #overlay>
      <a-menu @click="state.handleSetLocale">
        <a-menu-item key="zh-CN">
          <span :class="{ 'text-blue-500': appStore.language === 'zh-CN' }">
            简体中文
          </span>
        </a-menu-item>
        <a-menu-item key="en-US">
          <span :class="{ 'text-blue-500': appStore.language === 'en-US' }">
            English
          </span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts" name="LocaleIcon">
import type { LanguageType } from '@/store/useAppStore'
import { useAppStore } from '@/store'

const { locale } = useI18n()
const appStore = useAppStore()

const state = reactive({
  handleSetLocale({ key }: { key: LanguageType }) {
    appStore.setLanguage(key)
    locale.value = key
  }
})
</script>
