<template>
  <a-card size="small" class="mb-3">
    <BaseSearch
      ref="searchRef"
      :formItem="search.formItem"
      @search="search.handleSearch"
    />
  </a-card>
  <a-card size="small">
    <a-space class="mb-3">
      <add-dict-type @refresh="search.handleReset" />
      <a-button type="primary">刷新缓存</a-button>
      <a-button type="primary">导出</a-button>
      <a-button type="primary">导入</a-button>
      <a-button
        type="primary"
        :disabled="!table.selectedRowKeys.length"
        danger
        @click="table.handleBatchDelete"
      >
        批量删除
      </a-button>
    </a-space>
    <BaseTable
      :loading="loading"
      :data-source="dataSource"
      :columns="columns"
      :attr="table.attr"
      @rowSelection="table.handleSelection"
      @change="table.handleLoad"
    >
      <template #bodyCell="{ record, column: { dataIndex } }">
        <template v-if="dataIndex === 'act'">
          <a-space :size="0">
            <add-dict-type @refresh="search.handleReset" is-edit />
            <a-button
              type="link"
              size="small"
              @click="table.handleShowDrawer(record, 1)"
            >
              编辑
            </a-button>
            <a-button
              type="link"
              size="small"
              @click="table.handleShowDrawer(record, 2)"
            >
              字典配置
            </a-button>
            <a-button
              type="link"
              size="small"
              danger
              @click="table.handleDelete(record)"
            >
              删除
            </a-button>
          </a-space>
        </template>
      </template>
    </BaseTable>
  </a-card>
</template>

<script setup lang="ts" name="DictList">
import { type TableColumnProps } from 'ant-design-vue'
import BaseTable from '@/components/BaseTable'
import BaseSearch from '@/components/BaseSearch'
import AddDictType from './components/AddDictType.vue'
import { getDictList, delDictType } from '@/api/systemDict'
import { useModal } from '@/utils/useModal'

const { modal, message } = useModal()
const searchRef = ref<InstanceType<typeof BaseSearch> | null>(null)
const search = reactive({
  formData: {},
  formItem: [
    { label: '字典名称', prop: 'dictName', value: undefined },
    { label: '字典编码', prop: 'dictCode', value: undefined }
  ],
  //搜索
  handleSearch(formData: any) {
    search.formData = formData
    //table.handleLoad()
  },
  //重置
  handleReset() {
    searchRef.value?.handleReset()
  }
})

//表格
const table = reactive({
  loading: false,
  dataSource: [],
  columns: [
    { title: '字典名称', dataIndex: 'dictName' },
    { title: '字典编码', dataIndex: 'dictCode' },
    { title: '描述', dataIndex: 'description' },
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
  attr: {
    rowSelection: {}
  },
  selectedRowKeys: [] as Array<any>,
  selectedRows: [] as Array<any>,
  //加载数据
  handleLoad: async (e?: any) => {
    console.log('🚀 ~ :', e)
    table.loading = true
    const { code, data } = await getDictList({
      ...search.formData,
      ...table.pages
    })
    if (code === 200) {
      table.dataSource = data.records
      table.total = data.total
    }
    table.loading = false
  },
  //选中行数据
  handleSelection({ selectedRowKeys, selectedRows }: any) {
    table.selectedRowKeys = selectedRowKeys
    table.selectedRows = selectedRows
  },
  //显示抽屉
  handleShowDrawer(record: any, type: number) {
    console.log('显示抽屉', record, type)
  },
  //单条删除
  async handleDelete(record: any) {
    const confirm = await modal.confirm('确认删除该字典类型吗？')
    if (confirm) {
      if (!record.id) return message.error('未获取到该条数据id')
      try {
        const { code, msg } = await delDictType(record.id)
        if (code === 200) {
          message.success(msg)
          //table.handleLoad()
        } else {
          message.error(msg)
        }
      } catch (err) {
        console.log('🚀 ~ :', err)
      }
    }
  },
  //批量删除
  async handleBatchDelete() {
    const confirm = await modal.confirm('确认删除选中的字典类型吗？')
    if (confirm) {
      try {
        const { code, msg } = await delDictType(table.selectedRowKeys.join(','))
        if (code === 200) {
          message.success(msg)
          table.selectedRowKeys = []
          table.selectedRows = []
          table.handleLoad()
        } else {
          message.error(msg)
        }
      } catch (err) {
        console.log('🚀 ~ :', err)
      }
    }
  },
  //刷新
  handleRefresh(boole: boolean) {
    if (!boole) table.pages.current = 1
    //table.handleLoad()
  }
})

onMounted(() => {
  table.handleLoad()
})

const { loading, dataSource, columns } = toRefs(table)
</script>
