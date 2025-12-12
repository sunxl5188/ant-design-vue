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
        <!-- <ReloadOutlined
          v-if="appStore.currentTab === item.key"
          class="text-gray-500 text-xs hover:text-primary"
          :spin="item.spin"
          :rotate="180"
          @click.stop="state.handleRefresh(item)"
        /> -->
        <CloseOutlined
          v-if="item.key !== '/workplace' && appStore.currentTab === item.key"
          class="text-xs text-gray-500"
          @click.stop="state.handleClosable(item.key)"
        />
      </template>
    </a-tab-pane>
    <template #rightExtra>
      <div class="flex items-stretch">
        <div class="border-slate-200 border-l border-solid px-2">
          <ReloadOutlined />
        </div>
        <a-dropdown>
          <a class="ant-dropdown-link" @click.prevent>
            <MoreOutlined />
          </a>
          <template #overlay>
            <a-menu @click="state.handleTabMenuClick">
              <a-menu-item key="closeOther">{{ $t('a.a1') }}</a-menu-item>
              <a-menu-item key="refresh">{{ $t('a.a2') }}</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </template>
  </a-tabs>
</template>

<script setup lang="ts" name="LayoutTabs">
import { useAppStore } from '@/store'
import type { SiderTabType } from '@/types/useAppStore.d.ts'

const appStore = useAppStore()
const { tabs, selectedKeys, currentTab } = toRefs(appStore)
const router = useRouter()
const state = reactive({
  tabBarStyle: computed(() => {
    return {
      background:
        appStore.theme === 'light'
          ? '#fff'
          : (appStore.themeToken.colorBgBase as string),
      padding: '0 16px',
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
  handleRefresh(item: SiderTabType) {
    item.spin = true
    setTimeout(() => {
      item.spin = false
      appStore.refreshPage()
    }, 500)
  },
  handleTabMenuClick({ key }: { key: string }) {
    let data = [...tabs.value]
    if (key === 'closeOther') {
      data = data.filter(
        item => item.key === currentTab.value || item.key === '/workplace'
      )
      appStore.setTabs(data)
    } else if (key === 'refresh') {
      const currentTabs = data.find(item => item.key === currentTab.value)
      if (currentTabs) {
        state.handleRefresh(currentTabs)
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
.ant-tabs {
  .ant-tabs-tab .anticon {
    margin-right: 0;
    margin-left: 8px;
  }
}
:deep(.ant-tabs-extra-content) {
  height: 100%;
  display: flex;
  align-items: stretch;
}
</style>
