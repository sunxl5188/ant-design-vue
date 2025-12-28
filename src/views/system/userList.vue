<template>
  <div class="h-full flex items-stretch flex-col">
    <a-card size="small" class="mb-2">
      <BaseSearch :formItem="search.formItem" @search="search.handleSearch" />
    </a-card>
    <div class="flex-1 overflow-y-auto" id="table-card">
      <a-card size="small">
        <a-space class="mb-2 table-card-header">
          <a-button type="primary">添加用户</a-button>
          <a-button danger>批量删除</a-button>
        </a-space>
        <BaseTable
          :loading="loading"
          :data-source="dataSource"
          :columns="columns"
          :attr="table.attr"
          :selectedRowKeys="table.selectedRowKeys"
          :selectedRows="table.selectedRows"
          @rowSelection="table.handleSelection"
        >
          <template #bodyCell="{ text, record, column: { dataIndex } }">
            <template v-if="dataIndex === 'status'">
              <span
                :class="[
                  { 'text-green-500': record.status === '1' },
                  { 'text-red-500': record.status === '2' }
                ]"
                v-dict="{ user_status: text }"
              >
                {{ text }}
              </span>
            </template>
            <template v-if="dataIndex === 'act'">
              <a-space :size="0">
                <a-button
                  type="link"
                  size="small"
                  @click="table.handleShowDrawer(record, 1)"
                >
                  详情
                </a-button>
                <a-button
                  type="link"
                  size="small"
                  @click="table.handleShowDrawer(record, 2)"
                >
                  编辑
                </a-button>
                <a-dropdown>
                  <a class="text-primary" @click.prevent>
                    更多
                    <DownOutlined />
                  </a>
                  <template #overlay>
                    <a-menu @click="table.handleMenu($event, record)">
                      <a-menu-item key="1">删除</a-menu-item>
                      <a-menu-item key="2">修改密码</a-menu-item>
                      <a-menu-item key="3">冻结</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-space>
            </template>
          </template>
        </BaseTable>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts" name="UserList">
import type { TableColumnProps } from 'ant-design-vue'
import BaseTable from '@/components/BaseTable'
import BaseSearch from '@/components/BaseSearch'
import { userPage } from '@/api/systemcUser'

const search = reactive({
  formData: {} as Record<string, any>,
  formItem: [
    { label: '账号', prop: 'account', value: undefined },
    { label: '姓名', prop: 'nickName', value: undefined },
    {
      label: '性别',
      prop: 'sex',
      value: undefined,
      type: 'select',
      dict: 'sex'
    },
    { label: '手机号', prop: 'phone', value: undefined },
    {
      label: '用户状态',
      prop: 'status',
      value: undefined,
      type: 'select',
      dict: 'user_status'
    },
    {
      label: '部门',
      prop: 'dept',
      value: undefined
    }
  ],
  //搜索
  handleSearch(formData: any) {
    search.formData = formData
    table.handleLoad()
  }
})

//表格
const table = reactive({
  loading: false,
  dataSource: [],
  columns: [
    { title: '用户账号', dataIndex: 'account', align: 'center', minWidth: 120 },
    { title: '用户姓名', dataIndex: 'nickName', align: 'center' },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 80,
      align: 'center',
      dict: 'sex'
    },
    { title: '手机号', dataIndex: 'phone', align: 'center' },
    {
      title: '部门',
      dataIndex: 'dept',
      width: 200,
      tip: true
    },
    { title: '负责部门', dataIndex: 'mainDept' },
    { title: '主岗位', dataIndex: 'mainPost', align: 'center' },
    { title: '兼职岗位', dataIndex: 'partPost', align: 'center' },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      dict: 'user_status'
    },
    {
      title: '操作',
      dataIndex: 'act',
      width: 180,
      fixed: 'right',
      align: 'center'
    }
  ] as TableColumnProps[],
  total: 0,
  selectedRowKeys: [] as Array<any>,
  selectedRows: [] as Array<any>,
  attr: {
    rowSelection: {}
  },
  //加载数据
  handleLoad: async () => {
    table.loading = true
    const { code, data } = await userPage(search.formData)
    if (code === 200) {
      table.dataSource = data.records
      table.total = data.total
    }
    table.loading = false
  },
  handleSelection({
    selectedRowKeys,
    selectedRows
  }: {
    selectedRowKeys: Array<any>
    selectedRows: Array<any>
  }) {
    table.selectedRowKeys = selectedRowKeys
    table.selectedRows = selectedRows
  },
  //显示抽屉
  handleShowDrawer(record: any, type: number) {
    console.log('显示抽屉', record, type)
  },
  //删除
  handleDelete: (record: any) => {
    console.log('🚀 ~ record:', record)
  },
  handleMenu({ key }: { key: string }, record: any) {
    console.log(key, record)
  }
})

onMounted(() => {
  table.handleLoad()
})

const { loading, dataSource, columns } = toRefs(table)
</script>
