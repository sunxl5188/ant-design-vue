<template>
  <a-table
    :loading="loading"
    :columns="state.columnData"
    :data-source="dataSource"
    :pagination="state.pagination"
    v-bind="state.attribute"
    v-on="event"
    @change="state.handleChange"
  >
    <template #bodyCell="{ text, record, index, column }">
      <slot
        name="bodyCell"
        :text="text"
        :record="record"
        :index="index"
        :column="column"
      >
        <template v-if="column.tip">
          <BaseTip :title="text" isOverflow />
        </template>
        <template v-else>{{ text }}</template>
      </slot>
    </template>
  </a-table>
</template>

<script setup lang="ts" name="BaseTable">
import type {
  TableProps,
  PaginationProps,
  TableColumnProps
} from 'ant-design-vue'
import { merge } from 'lodash-es'
import BaseTip from '../BaseTip'

/*
Omit、Pick、Partial、Required、Readonly、Record、Exclude、Extract、NonNullable、Parameters、ConstructorParameters、ReturnType、InstanceType
type TableColumnProps = Omit<AntdTableColumnProps, 'fixed'> & {
  fixed?: FixedType
} */

interface PropsType {
  loading: boolean
  columns: TableColumnProps[]
  dataSource: Array<any>
  pagination?: PaginationProps
  attr?: TableProps
  event?: any
  expanded?: boolean
  selectedRowKeys?: Array<any>
  selectedRows?: Array<any>
  divId?: string
}

const emit = defineEmits(['rowSelection'])
let resizeObserver: ResizeObserver | null = null

const props = withDefaults(defineProps<PropsType>(), {
  loading: false,
  columns() {
    return []
  },
  dataSource: () => [],
  pagination: () => {
    return {}
  },
  attr: () => {
    return {}
  },
  event: () => {
    return {}
  },
  expanded: false,
  selectedRowKeys: () => {
    return []
  },
  selectedRows: () => {
    return []
  },
  divId: 'table-card'
})

const rowSelection = {
  selections: false,
  columnWidth: 60,
  hideDefaultSelections: true,
  preserveSelectedRowKeys: true,
  type: 'checkbox',
  selectedRowKeys: [],
  onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
    if (state.attribute.rowSelection) {
      state.attribute.rowSelection.selectedRowKeys = selectedRowKeys
    }
    state.selectedRows = selectedRows
    emit('rowSelection', { selectedRowKeys, selectedRows })
  }
} as TableProps['rowSelection']

const state = reactive({
  // 全局默认配置
  columnData: computed(() => {
    return props.columns.map(col => {
      col.width = col.width || undefined
      col.maxWidth = col.maxWidth || 230
      col.minWidth = col.minWidth || 80
      return col
    })
  }),
  //选中的行
  selectedRows: [] as Array<any>,
  //表格属性
  attribute: merge(
    {
      tableLayout: 'fixed',
      rowKey: 'id',
      bordered: true,
      minWidth: 80,
      scroll: {
        x: 'max-content',
        y: undefined as string | number | undefined,
        scrollToFirstRowOnChange: true
      },
      //列表项是否可选择
      rowSelection: props.attr?.rowSelection ? rowSelection : null
    },
    props.attr
  ),
  pagination: computed(() => {
    const { pageSize } = props.pagination
    let obj: PaginationProps = {
      current: 1,
      pageSize: 10,
      total: 0,
      pageSizeOptions: ['10', '20', '50', '100'],
      showQuickJumper: true,
      showLessItems: false,
      showSizeChanger: true
    }
    if (pageSize && pageSize < 10) {
      obj = {
        current: 1,
        pageSize: 5,
        total: 0,
        pageSizeOptions: [`${pageSize}`, '10', '20', '30', '50'],
        showQuickJumper: false,
        showLessItems: true,
        showSizeChanger: false
      }
    }
    return {
      ...obj,
      ...props.pagination
    }
  }),
  //判断文本是否益出~文本必须是单行
  tooltipDisabled: false,
  isBeyond(e: any) {
    const ev = window.event || e
    const textContent = ev.target
    const clientW = textContent.clientWidth
    const scrollW = textContent.scrollWidth
    state.tooltipDisabled = scrollW > clientW
  },
  //序号
  indexMethod: computed(() => (i: number) => {
    const { current, pageSize } = state.pagination
    if (current && pageSize) return current * pageSize - pageSize + (i + 1)
    return i + 1
  }),
  //分页、排序、筛选变化时触发
  handleChange(pagination: PaginationProps, filters: any, sorter: any) {
    state.pagination.current = pagination.current || 1
    if (pagination.pageSize) state.pagination.pageSize = pagination.pageSize
    // 排序
    if (sorter?.field) {
      console.log(sorter)
      //const order = sorter.order === 'ascend' ? 'asc' : 'desc'
      //props.event?.onSort?.(sorter.field, order)
    }
    // 过滤
    props.event?.onFilter?.(filters)
  },
  //计算表格高度
  handleTableHeight() {
    setTimeout(() => {
      let paginationHeight = 0
      let tableHeaderHeight = 0
      let bodyPadding = 0
      const id = `#${props.divId}`
      const myTable = document.querySelector<HTMLElement>(`${id}`)
      const bodyElement = document.querySelector<HTMLElement>(
        `${id} .ant-card-body`
      )

      if (bodyElement) {
        bodyPadding = getComputedStyle(bodyElement).paddingTop.match(
          /\d+/
        )?.[0] as unknown as number
        bodyPadding = bodyPadding * 2 + 2
      }

      const header = document.querySelector<HTMLElement>(
        `${id} .table-card-header`
      )
      if (!myTable && !header) return
      const cardHeight = myTable?.offsetHeight || 0
      const headerHeight = (header?.getBoundingClientRect()?.height || 0) + 8

      tableHeaderHeight =
        document.querySelector<HTMLElement>(`${id} .ant-table-header`)
          ?.offsetHeight || 0
      const pagination = document.querySelector<HTMLElement>(
        `${id} .ant-pagination`
      )
      if (pagination) {
        const pad =
          getComputedStyle(pagination).marginTop.match(/\d+/)?.[0] || 0
        paginationHeight = Number(pad) * 2 + pagination.offsetHeight
      }
      state.attribute.scroll.y =
        cardHeight -
        bodyPadding -
        headerHeight -
        tableHeaderHeight -
        paginationHeight
    }, 0)
  }
})

onMounted(() => {
  //监听元素尺寸变化
  resizeObserver = new ResizeObserver(() => {
    state.handleTableHeight()
  })
  const tableCard = document.getElementById(props.divId)
  if (tableCard) resizeObserver.observe(tableCard)
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    const tableCard = document.getElementById(props.divId)
    if (tableCard) resizeObserver.unobserve(tableCard)
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

watch(
  () => [props.selectedRowKeys, props.selectedRows],
  ([keys, rows]) => {
    if (state.attribute.rowSelection && keys?.length) {
      state.attribute.rowSelection.selectedRowKeys = keys
    }
    if (rows?.length) state.selectedRows = rows
  },
  { immediate: true }
)
</script>
