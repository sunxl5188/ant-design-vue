<template>
  <a-button
    v-if="mode === 'view'"
    type="link"
    size="small"
    @click="state.handleShowDrawer"
  >
    查看字典
  </a-button>
  <a-button v-else type="link" size="small" @click="state.handleShowDrawer">
    字典配置
  </a-button>
  <a-drawer
    v-if="state.visible"
    v-model:open="state.visible"
    title="字典列表"
    width="800px"
  >
    <base-search :form-item="search.formItem" @search="search.handleSearch" />
    <div v-if="mode !== 'view'" class="mb-2">
      <add-or-edit-dict
        :record="{ dictCode: record.dictCode }"
        @refresh="search.handleSearch"
      />
    </div>
    <base-table
      :loading="state.loading"
      :data-source="state.dataSource"
      :columns="state.columns"
      :total="state.total"
      v-model:current="state.pages.current"
      v-model:pageSize="state.pages.pageSize"
      @change="state.handleLoad"
    >
      <template #bodyCell="{ record, text, column: { dataIndex } }">
        <template v-if="dataIndex === 'color' && text">
          <span
            class="w-6 h-4 inline-block rounded-sm"
            :style="`background:${text}`"
          ></span>
        </template>
        <template v-if="dataIndex === 'act' && mode !== 'view'">
          <a-space>
            <add-or-edit-dict
              :record="record"
              is-edit
              @refresh="state.handleLoad()"
            />
            <a-button
              type="link"
              size="small"
              danger
              @click="state.handleDelete(record)"
            >
              删除
            </a-button>
          </a-space>
        </template>
      </template>
    </base-table>
  </a-drawer>
</template>

<script setup lang="ts" name="DrawerDictList">
import AddOrEditDict from './AddOrEditDict.vue'
import { useModal } from '@/utils/useModal'
import { getDictList, delDictData } from '@/api/systemDict'

interface PropsType {
  record: Record<string, any>
  mode?: string
}
const props = withDefaults(defineProps<PropsType>(), {
  record: () => ({}),
  mode: ''
})

const { modal, message } = useModal()
// 搜索表单
const search = reactive({
  formData: {},
  formItem: [
    { label: '字典名称', prop: 'dictName', value: undefined },
    {
      label: '字典状态',
      prop: 'status',
      value: undefined,
      type: 'select',
      dict: 'dict_item_status'
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
  handleShowDrawer() {
    state.handleLoad()
    state.visible = true
  },
  loading: false,
  dataSource: [],
  columns: [
    {
      title: '字典名称',
      dataIndex: 'dictName'
    },
    {
      title: '数据值',
      dataIndex: 'dictValue'
    },
    {
      title: '字典颜色',
      dataIndex: 'color'
    },
    {
      title: '操作',
      dataIndex: 'act',
      width: 120,
      align: 'center'
    }
  ],
  total: 0,
  pages: {
    current: 1,
    pageSize: 10
  },
  //加载数据
  handleLoad: async () => {
    state.loading = true
    const params = {
      dictCode: props.record.dictCode,
      ...search.formData,
      ...state.pages
    }
    const { code, data } = await getDictList(params)
    if (code === 200) {
      state.dataSource = data.records
      state.total = data.total
    }
    state.loading = false
  },
  //删除字典类型
  async handleDelete(record: any) {
    const confirm = await modal.confirm('确认删除该字典数据吗？')
    if (confirm && record.id) {
      const { code, msg } = await delDictData(record.id)
      if (code === 200) {
        message.success(msg)
        state.handleLoad()
      } else {
        message.error(msg)
      }
    } else {
      message.error('未获取到该条数据id')
    }
  }
})
</script>
