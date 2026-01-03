<template>
  <div class="h-full flex items-stretch flex-col">
    <a-card size="small" class="mb-3">
      <base-search :formItem="search.formItem" @search="search.handleSearch" />
    </a-card>
    <div class="flex-1 overflow-y-auto" id="table-card">
      <a-card size="small" class="h-full">
        <a-space class="mb-2 table-card-header">
          <add-dict-type @refresh="search.handleSearch" />
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
        <base-table
          :loading="loading"
          :data-source="dataSource"
          :columns="columns"
          :attr="table.attr"
          :total="table.total"
          full-height
          v-model:current="table.pages.current"
          v-model:pageSize="table.pages.pageSize"
          @rowSelection="table.handleSelection"
          @change="table.handleLoad"
        >
          <template #bodyCell="{ record, column: { dataIndex } }">
            <template v-if="dataIndex === 'system'">
              {{ record.system === '1' ? '系统类型' : '业务类型' }}
            </template>
            <template v-if="dataIndex === 'act'">
              <a-space v-if="record.system === '2'">
                <add-dict-type
                  is-edit
                  :record="record"
                  @refresh="table.handleLoad"
                />
                <drawer-dict-list :record="record" />
                <a-button
                  type="link"
                  size="small"
                  danger
                  @click="table.handleDelete(record)"
                >
                  删除
                </a-button>
              </a-space>
              <drawer-dict-list v-else :record="record" mode="view" />
            </template>
          </template>
        </base-table>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts" name="DictList">
import { type TableColumnProps } from 'ant-design-vue'
import BaseTable from '@/components/BaseTable'
import BaseSearch from '@/components/BaseSearch'
import AddDictType from './components/AddDictType.vue'
import DrawerDictList from './components/DrawerDictList.vue'
import { getDictTypeList, delDictType } from '@/api/systemDict'
import { useModal } from '@/utils/useModal'

const { modal, message } = useModal()
const search = reactive({
  formData: {},
  formItem: [
    { label: '字典名称', prop: 'dictName', value: undefined },
    { label: '字典编码', prop: 'dictCode', value: undefined }
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
    { title: '字典名称', dataIndex: 'dictName' },
    { title: '字典编码', dataIndex: 'dictCode' },
    { title: '描述', dataIndex: 'description' },
    { title: '状态', dataIndex: 'system', align: 'center' },
    {
      title: '操作',
      dataIndex: 'act',
      width: 180,
      fixed: 'right',
      align: 'center'
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
  handleLoad: async () => {
    table.loading = true
    const { code, data } = await getDictTypeList({
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
  //单条删除
  async handleDelete(record: any) {
    const confirm = await modal.confirm('确认删除该字典类型吗？')
    if (confirm) {
      if (!record.id) return message.error('未获取到该条数据id')
      try {
        const { code, msg } = await delDictType(record.id)
        if (code === 200) {
          message.success(msg)
          table.handleLoad()
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
  }
})

onMounted(() => {
  table.handleLoad()
})

const { loading, dataSource, columns } = toRefs(table)
</script>
