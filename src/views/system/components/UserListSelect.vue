<template>
  <a-button type="primary" @click="modal.handleShowModal">选择用户</a-button>
  <a-modal
    v-if="modal.visible"
    title="选择用户"
    :open="modal.visible"
    :confirmLoading="modal.confirmLoading"
    width="1000px"
    centered
    destroyOnClose
    @ok="modal.handleSubmit"
    @cancel="modal.handleCancel"
  >
    <base-table
      :columns="state.columns"
      :dataSource="state.dataSource"
      :loading="state.loading"
      :attr="state.attr"
      v-model:current="state.pages.current"
      v-model:pageSize="state.pages.pageSize"
      :total="state.total"
      @change="state.handleLoad"
    >
      <template #bodyCell="{ text, column: { dict } }">
        <template v-if="dict">
          <span :style="`color:${getDictColor(dict, text)}`">
            {{ getDictFilter(dict, text) }}
          </span>
        </template>
      </template>
    </base-table>
  </a-modal>
</template>

<script setup lang="ts" name="UserListSelect">
import type { TableColumnProps } from 'ant-design-vue'
import { userPage } from '@/api/systemUser'
import { getDictFilter, getDictColor } from '@/utils'
// const props = defineProps({
//   record: { type: Object, default: () => ({}) }
// })
// 事件
//const emit = defineEmits(['refresh'])

// 弹框操作
const modal = reactive({
  visible: false,
  confirmLoading: false,
  // 弹框显示
  handleShowModal() {
    state.handleLoad()
    modal.visible = true
  },
  //关闭弹窗
  handleCancel: () => {
    modal.visible = false
  },
  handleSubmit() {
    //...
  }
})

// 搜索表单
const search = reactive({
  formData: {},
  formItem: [
    {
      label: '用户名称',
      prop: 'nickName',
      value: undefined
    },
    {
      label: '用户账号',
      prop: 'account',
      value: undefined
    }
  ],
  //搜索
  handleSearch(data: any) {
    search.formData = data
    state.pages.current = 1
    state.handleLoad()
  },
  async handleLoad() {
    //===
  }
})

const state = reactive({
  visible: false,
  loading: false,
  selectedRowKeys: [] as Array<any>,
  selectedRows: [] as Array<any>,
  dataSource: [],
  columns: [
    { title: '用户名称', dataIndex: 'nickName' },
    { title: '用户账号', dataIndex: 'account' },
    { title: '状态', dataIndex: 'status', dict: 'tenant_status' }
  ] as TableColumnProps[],
  total: 0,
  pages: {
    current: 1,
    pageSize: 10
  },
  attr: {
    rowSelection: {
      getCheckboxProps: (record: any) => ({
        disabled: record.status === '0' // 不能选择禁用状态的用户
      })
    }
  },
  handleShowDrawer() {
    state.visible = true
  },
  async handleLoad() {
    const { code, data } = await userPage({
      ...search.formData,
      ...state.pages
    })
    if (code === 200) {
      state.dataSource = data.records
      state.total = data.total
    }
  }
})
</script>
