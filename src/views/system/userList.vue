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
                  { 'text-green-500': record.status === '启用' },
                  { 'text-red-500': record.status === '禁用' }
                ]"
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

const search = reactive({
  formItem: [
    { label: '账号', prop: 'account', value: undefined },
    { label: '姓名', prop: 'name', value: undefined },
    {
      label: '性别',
      prop: 'gender',
      value: undefined,
      type: 'select',
      dict: 'sex'
    },
    { label: '手机号', prop: 'phone', value: undefined },
    { label: '用户状态', prop: 'status', value: undefined },
    {
      label: '用户类型',
      prop: 'type',
      value: undefined,
      type: 'select',
      api: '/home/index/webSystemDict',
      params: { dictType: 'week' }
    },
    {
      label: '部门',
      prop: 'dept',
      value: undefined
    }
  ],
  //搜索
  handleSearch(formData: any) {
    console.log('搜索数据', formData)
    table.handleLoad()
  }
})

//表格
const table = reactive({
  loading: false,
  dataSource: [
    {
      id: 1,
      account: 'user1',
      name: '姓名1',
      gender: '男',
      phone: '13800000001',
      dept: '北京国炬软件信息/低代码研发小组',
      mainDept: '主部门1',
      mainPost: '岗位1',
      partPost: '',
      status: '启用',
      act: ''
    },
    {
      id: 2,
      account: 'user2',
      name: '姓名2',
      gender: '女',
      phone: '13800000002',
      dept: '北京敲敲云科技',
      mainDept: '',
      mainPost: '岗位2',
      partPost: '兼职2',
      status: '禁用',
      act: ''
    },
    {
      id: 3,
      account: 'user3',
      name: '姓名3',
      gender: '男',
      phone: '13800000003',
      dept: '部门3',
      mainDept: '主部门3',
      mainPost: '岗位3',
      partPost: '兼职1',
      status: '启用',
      act: ''
    },
    {
      id: 4,
      account: 'user4',
      name: '姓名4',
      gender: '女',
      phone: '13800000004',
      dept: '部门4',
      mainDept: '主部门1',
      mainPost: '岗位4',
      partPost: '兼职2',
      status: '禁用',
      act: ''
    },
    {
      id: 5,
      account: 'user5',
      name: '姓名5',
      gender: '男',
      phone: '13800000005',
      dept: '部门5',
      mainDept: '主部门2',
      mainPost: '岗位1',
      partPost: '兼职1',
      status: '启用',
      act: ''
    },
    {
      id: 6,
      account: 'user6',
      name: '姓名6',
      gender: '女',
      phone: '13800000006',
      dept: '部门1',
      mainDept: '主部门3',
      mainPost: '岗位2',
      partPost: '兼职2',
      status: '禁用',
      act: ''
    },
    {
      id: 7,
      account: 'user7',
      name: '姓名7',
      gender: '男',
      phone: '13800000007',
      dept: '部门2',
      mainDept: '主部门1',
      mainPost: '岗位3',
      partPost: '兼职1',
      status: '启用',
      act: ''
    },
    {
      id: 8,
      account: 'user8',
      name: '姓名8',
      gender: '女',
      phone: '13800000008',
      dept: '部门3',
      mainDept: '主部门2',
      mainPost: '岗位4',
      partPost: '兼职2',
      status: '禁用',
      act: ''
    },
    {
      id: 9,
      account: 'user9',
      name: '姓名9',
      gender: '男',
      phone: '13800000009',
      dept: '部门4',
      mainDept: '主部门3',
      mainPost: '岗位1',
      partPost: '兼职1',
      status: '启用',
      act: ''
    },
    {
      id: 10,
      account: 'user10',
      name: '姓名10',
      gender: '女',
      phone: '13800000010',
      dept: '部门5',
      mainDept: '主部门1',
      mainPost: '岗位2',
      partPost: '兼职2',
      status: '禁用',
      act: ''
    }
    /* {
      id: 11,
      account: 'user11',
      name: '姓名11',
      gender: '男',
      phone: '13800000011',
      dept: '部门1',
      mainDept: '主部门2',
      mainPost: '岗位3',
      partPost: '兼职1',
      status: '启用',
      act: ''
    },
    {
      id: 12,
      account: 'user12',
      name: '姓名12',
      gender: '女',
      phone: '13800000012',
      dept: '部门2',
      mainDept: '主部门3',
      mainPost: '岗位4',
      partPost: '兼职2',
      status: '禁用',
      act: ''
    },
    {
      id: 13,
      account: 'user13',
      name: '姓名13',
      gender: '男',
      phone: '13800000013',
      dept: '部门3',
      mainDept: '主部门1',
      mainPost: '岗位1',
      partPost: '兼职1',
      status: '启用',
      act: ''
    },
    {
      id: 14,
      account: 'user14',
      name: '姓名14',
      gender: '女',
      phone: '13800000014',
      dept: '部门4',
      mainDept: '主部门2',
      mainPost: '岗位2',
      partPost: '兼职2',
      status: '禁用',
      act: ''
    },
    {
      id: 15,
      account: 'user15',
      name: '姓名15',
      gender: '男',
      phone: '13800000015',
      dept: '部门5',
      mainDept: '主部门3',
      mainPost: '岗位3',
      partPost: '兼职1',
      status: '启用',
      act: ''
    },
    {
      id: 16,
      account: 'user16',
      name: '姓名16',
      gender: '女',
      phone: '13800000016',
      dept: '部门1',
      mainDept: '主部门1',
      mainPost: '岗位4',
      partPost: '兼职2',
      status: '禁用',
      act: ''
    },
    {
      id: 17,
      account: 'user17',
      name: '姓名17',
      gender: '男',
      phone: '13800000017',
      dept: '部门2',
      mainDept: '主部门2',
      mainPost: '岗位1',
      partPost: '兼职1',
      status: '启用',
      act: ''
    },
    {
      id: 18,
      account: 'user18',
      name: '姓名18',
      gender: '女',
      phone: '13800000018',
      dept: '部门3',
      mainDept: '主部门3',
      mainPost: '岗位2',
      partPost: '兼职2',
      status: '禁用',
      act: ''
    },
    {
      id: 19,
      account: 'user19',
      name: '姓名19',
      gender: '男',
      phone: '13800000019',
      dept: '部门4',
      mainDept: '主部门1',
      mainPost: '岗位3',
      partPost: '兼职1',
      status: '启用',
      act: ''
    },
    {
      id: 20,
      account: 'user20',
      name: '姓名20',
      gender: '女',
      phone: '13800000020',
      dept: '部门5',
      mainDept: '主部门2',
      mainPost: '岗位4',
      partPost: '兼职2',
      status: '禁用',
      act: ''
    } */
  ],
  columns: [
    { title: '用户账号', dataIndex: 'account', align: 'center' },
    { title: '用户姓名', dataIndex: 'name', align: 'center' },
    { title: '性别', dataIndex: 'gender', width: 80, align: 'center' },
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
    { title: '状态', dataIndex: 'status', align: 'center' },
    {
      title: '操作',
      dataIndex: 'act',
      width: 180,
      fixed: 'right',
      align: 'center'
    }
  ] as TableColumnProps[],
  selectedRowKeys: [] as Array<any>,
  selectedRows: [] as Array<any>,
  attr: {
    rowSelection: {}
  },
  //加载数据
  handleLoad: async () => {
    table.loading = true
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

const { loading, dataSource, columns } = toRefs(table)
</script>
