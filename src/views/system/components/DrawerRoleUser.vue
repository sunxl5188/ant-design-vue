<template>
  <a-button type="link" size="small" @click="handleShowDrawer">用户</a-button>
  <a-drawer v-model:open="visible" title="角色用户" width="800px">
    <base-search :form-item="search.formItem" @search="search.handleSearch" />
    <a-space class="mb-2">
      <add-or-edit-user />
      <user-list-select />
    </a-space>
    <base-table
      :loading="state.loading"
      :data-source="state.dataSource"
      :columns="state.columns"
      :total="state.total"
      v-model:current="state.pages.current"
      v-model:pageSize="state.pages.pageSize"
      @change="state.handleLoad"
    >
      <template #bodyCell="{ record, column: { dataIndex } }">
        <template v-if="dataIndex === 'act'">
          <a-space>
            <add-or-edit-user
              :record="record"
              mode="edit"
              @refresh="state.handleLoad()"
            />
            <a-button type="link" size="small" danger>取消关联</a-button>
          </a-space>
        </template>
      </template>
    </base-table>
  </a-drawer>
</template>

<script setup lang="ts" name="DrawerRoleUser">
import type { TableColumnProps } from 'ant-design-vue'
import UserListSelect from './UserListSelect.vue'
import AddOrEditUser from './AddOrEditUser.vue'

defineProps({
  record: { type: Object, default: () => ({}) }
})

// 搜索表单
const search = reactive({
  formData: {},
  formItem: [
    {
      label: '用户名称',
      prop: 'userName',
      value: undefined
    },
    {
      label: '用户账号',
      prop: 'userAccount',
      value: undefined
    }
  ],
  //搜索
  handleSearch(data: any) {
    search.formData = data
    state.pages.current = 1
    state.handleLoad()
  }
})

const state = reactive({
  visible: false,
  loading: false,
  dataSource: [],
  columns: [
    {
      title: '用户名称',
      dataIndex: 'userName',
      align: 'center'
    },
    {
      title: '用户账号',
      dataIndex: 'account',
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'userEmail',
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'act',
      align: 'center',
      width: 150
    }
  ] as TableColumnProps[],
  total: 0,
  pages: {
    current: 1,
    pageSize: 10
  },
  attr: {},
  handleShowDrawer() {
    state.visible = true
  },
  async handleLoad() {
    //===
  }
})

const { visible, handleShowDrawer } = toRefs(state)
</script>

<style scoped lang="less"></style>
