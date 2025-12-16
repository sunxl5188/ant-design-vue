<template>
  <a-tabs
    v-model:activeKey="selectedKeys[0]"
    size="small"
    :tabBarStyle="state.tabBarStyle"
    @edit="state.handleClosable"
    @change="state.handleChange"
  >
    <a-tab-pane v-for="item in tabs" :key="item.key">
      <template #tab>
        {{ $t(item.title) }}
        <CloseOutlined
          v-if="item.key !== '/workplace'"
          class="text-xs text-gray-500"
          @click.stop="state.handleClosable(item.key)"
        />
      </template>
    </a-tab-pane>
    <template #rightExtra>
      <div class="flex items-stretch">
        <base-tip :title="$t('a.a2')">
          <ReloadOutlined
            class="border-slate-200 border-l border-solid px-2"
            @click="state.handleTabMenuClick({ key: 'refresh' })"
          />
        </base-tip>
        <a-dropdown>
          <MoreOutlined
            class="border-slate-200 border-l border-solid px-2"
            @click.prevent
          />
          <template #overlay>
            <a-menu @click="state.handleTabMenuClick">
              <a-menu-item key="closeOther" :disabled="tabs.length <= 2">
                {{ $t('a.a1') }}
              </a-menu-item>
              <a-menu-item key="closeAll" :disabled="tabs.length <= 1">
                {{ $t('a.a21') }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </template>
  </a-tabs>
</template>

<script setup lang="ts" name="LayoutTabs">
import { useAppStore } from '@/store'

const appStore = useAppStore()
const { tabs, selectedKeys, currentTab } = toRefs(appStore)
const route = useRoute()
const router = useRouter()

const state = reactive({
  tabBarStyle: computed(() => {
    return {
      background:
        appStore.theme === 'light'
          ? '#fff'
          : (appStore.themeToken.colorBgBase as string),
      padding: '0 0 0 16px',
      marginBottom: '0'
    }
  }),
  handleClosable(e: string) {
    const data = [...tabs.value]
    const index = data.findIndex(item => item.key === e)
    data.splice(index, 1)
    appStore.setTabs(data)
    const activeKey = tabs.value[index - 1]?.key || ''
    if (e === currentTab.value) {
      router.push(activeKey || '/workplace')
    }
  },
  handleTabMenuClick({ key }: { key: string }) {
    let data = [...tabs.value]
    if (key === 'closeOther') {
      data = data.filter(
        item => item.key === currentTab.value || item.key === '/workplace'
      )
      appStore.setTabs(data)
    } else if (key === 'closeAll') {
      data = data.filter(item => item.key === '/workplace')
      appStore.setTabs(data)
    } else if (key === 'refresh') {
      const currentTabs = data.find(item => item.key === currentTab.value)
      if (currentTabs) {
        appStore.refreshPage(route.name as string)
      }
    }
  },
  handleChange(key: string) {
    const keyArr = key.split('/')
    if (keyArr.length > 2) {
      appStore.setOpenKeys([`/${keyArr[1]}`])
    }
    router.push(key)
  }
})
</script>

<style scoped lang="less">
:deep(.ant-tabs-nav-list) {
  .ant-tabs-tab {
    &:not(:first-child) {
      .ant-tabs-tab-btn {
        padding-left: 16px;
      }
    }
    .anticon {
      margin-right: 0;
      margin-left: 4px;
      visibility: hidden;
    }
    &:hover {
      .anticon {
        visibility: visible;
      }
    }
  }
}
:deep(.ant-tabs-extra-content) {
  height: 100%;
  display: flex;
  align-items: stretch;
}
</style>
