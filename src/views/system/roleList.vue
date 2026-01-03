<template>
  <div class="h-full flex items-stretch flex-col">
    <a-card size="small" class="mb-2">
      <BaseSearch :formItem="search.formItem" @search="search.handleSearch" />
    </a-card>
    <div class="flex-1 overflow-y-auto" id="table-card">
      <a-card size="small" class="h-full">
        <a-space class="mb-2 table-card-header">
          <a-button type="primary">新增角色</a-button>
          <a-button>导出</a-button>
          <a-button>导入</a-button>
        </a-space>
        <BaseTable
          :loading="loading"
          :data-source="dataSource"
          :columns="columns"
          :total="table.total"
          full-height
          v-model:current="table.pages.current"
          v-model:pageSize="table.pages.pageSize"
          :attr="table.attr"
        >
          <template #bodyCell="{ record, column: { dataIndex } }">
            <template v-if="dataIndex === 'act'">
              <a-space :size="0">
                <drawer-role-user :record="record" />
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
    </div>
  </div>
</template>

<script setup lang="ts" name="RoleList">
import type { TableColumnProps } from 'ant-design-vue'
import BaseTable from '@/components/BaseTable'
import BaseSearch from '@/components/BaseSearch'
import DrawerRoleUser from './components/DrawerRoleUser.vue'
import { rolePage } from '@/api/role'

const search = reactive({
  formData: {},
  formItem: [
    { label: '角色名称', prop: 'roleName', value: undefined },
    { label: '角色编码', prop: 'roleCode', value: undefined }
  ],
  //搜索
  handleSearch(formData: any) {
    search.formData = formData
    table.pages.current = 1
    table.handleLoad()
  }
})

//表格
const table = reactive({
  loading: false,
  dataSource: [],
  columns: [
    { title: '角色名称', dataIndex: 'roleName' },
    { title: '角色编码', dataIndex: 'roleCode' },
    { title: '创建时间', dataIndex: 'createTime', width: 180 },
    {
      title: '操作',
      dataIndex: 'act',
      width: 180,
      fixed: 'right'
    }
  ] as TableColumnProps[],
  total: 0,
  pages: {
    current: 1,
    pageSize: 10
  },
  attr: {},
  //加载数据
  handleLoad: async () => {
    table.loading = true
    const { code, data } = await rolePage({
      ...search.formData,
      ...table.pages
    })
    if (code === 200) {
      table.dataSource = data.records
      table.total = data.total
    }
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

onMounted(() => {
  table.handleLoad()
})

const { loading, dataSource, columns } = toRefs(table)
</script>
