<template>
  <a-card size="small" class="mb-3">
    <BaseSearch :formItem="search.formItem" @search="search.handleSearch" />
  </a-card>
  <a-card size="small">
    <a-space class="mb-3">
      <a-button type="primary">新增字典</a-button>
      <a-button type="primary">刷新缓存</a-button>
      <a-button type="primary">导出</a-button>
      <a-button type="primary">导入</a-button>
      <a-button type="primary" danger>批量删除</a-button>
    </a-space>
    <BaseTable
      :loading="loading"
      :data-source="dataSource"
      :columns="columns"
      :attr="table.attr"
    >
      <template #bodyCell="{ record, column: { dataIndex } }">
        <template v-if="dataIndex === 'act'">
          <a-space :size="0">
            <a-button
              type="link"
              size="small"
              @click="table.handleShowDrawer(record, 1)"
            >
              用户
            </a-button>
            <a-button
              type="link"
              size="small"
              @click="table.handleShowDrawer(record, 2)"
            >
              授权
            </a-button>
            <a-dropdown>
              <a class="text-primary" @click.prevent>
                更多
                <DownOutlined />
              </a>
              <template #overlay>
                <a-menu @click="table.handleMenu($event, record)">
                  <a-menu-item key="edit">编辑</a-menu-item>
                  <a-menu-item key="view">详情</a-menu-item>
                  <a-menu-item key="del">删除</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </template>
      </template>
    </BaseTable>
  </a-card>
</template>

<script setup lang="ts" name="DictList">
import type { TableColumnProps } from 'ant-design-vue'
import BaseTable from '@/components/BaseTable'
import BaseSearch from '@/components/BaseSearch'

const search = reactive({
  formItem: [
    { label: '字典名称', prop: 'name', value: undefined },
    { label: '字典编码', prop: 'code', value: undefined }
  ],
  //搜索
  handleSearch(formData: any) {
    console.log('搜索数据', formData)
    table.handleLoad()
  },
})

//表格
const table = reactive({
  loading: false,
  dataSource: [],
  columns: [
    { title: '字典名称', dataIndex: 'name' },
    { title: '字典编码', dataIndex: 'code' },
    { title: '描述', dataIndex: 'description' },
    {
      title: '操作',
      dataIndex: 'act',
      width: 180,
      fixed: 'right'
    }
  ] as TableColumnProps[],
  attr: {},
  //加载数据
  handleLoad: async () => {
    table.loading = true
    table.loading = false
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

const { loading, dataSource, columns } = toRefs(table)
</script>

<style scoped lang="less">

</style>
