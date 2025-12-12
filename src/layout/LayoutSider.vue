<template>
  <a-layout-sider
    v-model:collapsed="appStore.collapsed"
    breakpoint="lg"
    :collapsed-width="state.collapsedWidth"
    :trigger="null"
    :style="state.styleObj"
    collapsible
    @collapse="handleCollapse"
  >
    <div class="flex justify-center items-center py-4">
      <svg-icon name="logo" class="" size="35px" />
      <h2 v-if="!appStore.collapsed" class="text-2xl font-bold ml-1 text-white">
        管理后台
      </h2>
    </div>
    <a-menu
      v-model:selectedKeys="appStore.selectedKeys"
      v-model:openKeys="appStore.openKeys"
      mode="inline"
      theme="dark"
      @select="handleSelect"
      @openChange="handleOpenChange"
    >
      <template v-for="item in userStore.sidebarRouters" :key="item.key">
        <a-sub-menu v-if="item.children" :key="item.key" :label="item.title">
          <template #icon>
            <component v-if="item.icon" :is="item.icon" />
          </template>
          <template #title>{{ $t(item.title) }}</template>
          <template v-for="sub in item.children" :key="sub.key">
            <a-menu-item v-if="!sub.children" :key="sub.key" :label="sub.title">
              <component v-if="sub.icon" :is="sub.icon" />
              {{ $t(sub.title) }}
            </a-menu-item>
            <!-- 递归支持多级菜单 -->
            <a-sub-menu v-else :key="sub.key + '-sub'" :label="sub.title">
              <template #icon>
                <component v-if="sub.icon" :is="sub.icon" />
              </template>
              <template #title>
                {{ $t(sub.title) }}
              </template>
              <!-- 递归渲染 sub.children -->
            </a-sub-menu>
          </template>
        </a-sub-menu>
        <a-menu-item v-else :key="item.key + ''" :label="item.title">
          <component v-if="item.icon" :is="item.icon" />
          <span class="ant-menu-title-content">{{ $t(item.title) }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script setup lang="ts" name="LayoutSider">
import type { SiderTabType } from '@/types/useAppStore.d.ts'
import { useAppStore } from '@/store/useAppStore'
import { useUserStore } from '@/store/useUserStore'

interface StateType {
  styleObj: Record<string, string>
  items: Array<SiderTabType>
  collapsedWidth: number
}

const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter()

const state = reactive<StateType>({
  styleObj: {},
  items: [],
  collapsedWidth: 48
})

const handleSelect = ({ key, item }: { key: string; item: SiderTabType }) => {
  router.push(key)
  const tabsData = [...appStore.tabs]
  const exists = tabsData.findIndex(tab => tab.key === key)
  if (exists === -1) {
    tabsData.push({
      title: item?.label as string,
      label: item?.label as string,
      key,
      spin: false
    })
    appStore.setTabs(tabsData)
  }
}

const handleOpenChange = (openKeys: Array<string>) => {
  // 收起时禁止弹出子菜单
  if (appStore.collapsed) return
  appStore.setOpenKeys(openKeys)
}

const handleCollapse = (collapsed: boolean) => {
  appStore.toggleCollapsed(collapsed)
}

const handleResize = () => {
  if (window.innerWidth < 992) {
    state.collapsedWidth = 0
  } else {
    state.collapsedWidth = 48
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

</script>
