<template>
  <a-layout-header :style="headerStyle">
    <div class="flex justify-between items-center">
      <span @click="appStore.toggleCollapsed(!appStore.collapsed)">
        <MenuFoldOutlined
          v-if="appStore.collapsed === false"
          class="text-base cursor-pointer"
        />
        <MenuUnfoldOutlined v-else class="text-base cursor-pointer" />
      </span>
      <a-space size="middle">
        <a-badge
          count="5"
          :overflow-count="99"
          status="error"
          :offset="[2, -5]"
        >
          <BellOutlined class="text-base cursor-pointer" />
        </a-badge>
        <a-dropdown trigger="click">
          <a class="ant-dropdown-link" @click.prevent>
            <div class="flex justify-center items-center">
              <a-avatar :size="24" shape="circle" :src="userInfo.avatar" />
              <span class="ml-1">{{ userInfo.nickName }}</span>
            </div>
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1">
                <UserOutlined />
                {{ $t('a.a3') }}
              </a-menu-item>
              <a-menu-item key="2">
                <SettingOutlined />
                {{ $t('a.a4') }}
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="3">
                <LogoutOutlined />
                {{ $t('a.a5') }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <LocaleIcon />
        <ThemeIcon />
      </a-space>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts" name="LayoutHeader">
import { useAppStore, useUserStore } from '@/store'
import { LocaleIcon, ThemeIcon } from '@/components/Setting'

const appStore = useAppStore()
const userStore = useUserStore()
const { userInfo } = userStore
const headerStyle = computed(() => ({
  height: '45px',
  lineHeight: '45px',
  paddingInline: 0,
  background: appStore.theme === 'dark' ? '#001529' : '#fff',
  padding: '0 15px',
  borderBottom:
    appStore.theme === 'dark' ? '1px solid #303030' : '1px solid #f0f0f0'
}))
</script>
