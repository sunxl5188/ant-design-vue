<template>
  <a-table
    :id="state.id"
    :loading="state.loading"
    :columns="state.columns"
    :data-source="state.dataSource"
    row-key="id"
    :pagination="false"
    :scroll="{ x: 1500, y: 300, scrollToFirstRowOnChange: true }"
  ></a-table>
</template>

<script setup lang="ts" name="TableScrollLoad">
import { v4 as uuid } from 'uuid'
import { debounce } from 'lodash-es'
const state = reactive({
  id: `table-${uuid()}`,
  loading: false,
  dataSource: [] as any[],
  columns: [
    { title: '编号', dataIndex: 'id' },
    { title: '姓名', dataIndex: 'buyerName', width: 120 },
    { title: '性别', dataIndex: 'gender', width: 80 },
    { title: '年龄', dataIndex: 'age', width: 80 },
    { title: '电话号码', dataIndex: 'phone', width: 140 },
    {
      title: '住址',
      dataIndex: 'addressDetail',
      width: 240,
      ellipsis: true
    },
    {
      title: '所属驿站',
      dataIndex: 'stationName',
      width: 240,
      ellipsis: true
    }
  ],
  currentPage: 1,
  pageSize: 20,
  total: 0,
  main: null as HTMLElement | null,
  bodyHeight: 0,
  tableHeight: 0,
  handleLoad: debounce(function () {
    state.loading = true
    setTimeout(() => {
      const len = state.currentPage * state.pageSize
      console.log(len)
      for (let i = len - state.pageSize; i < len; i++) {
        state.dataSource.push({
          id: `${i}`,
          buyerName: 'JJJLin',
          addressDetail: '小区1测试单元3302室',
          gender: '女',
          age: 23,
          address: `福建省厦门市思明区筼筜街道仙岳路${innerHeight}号翔业大厦`,
          visitTimeType: '8',
          stationName: '测试驿站'
        })
      }
      state.currentPage += 1
      state.loading = false
      nextTick(() => {
        state.queryTableAttribute()
      })
    }, 1000)
  }, 500),
  handleScroll: (e: any) => {
    const diffHeight = state.tableHeight - state.bodyHeight
    const target = e.target as HTMLElement
    //当前滚动位置
    let scrollTop = target.scrollTop
    if (diffHeight - scrollTop < 50) {
      state.handleLoad()
    }
  },
  queryTableAttribute: () => {
    state.bodyHeight =
      document.querySelector(`#${state.id} .ant-table-body`)?.clientHeight || 0
    state.tableHeight =
      document.querySelector(`#${state.id} .ant-table-body table`)
        ?.clientHeight || 0
  },
  handleBindScroll: () => {
    setTimeout(() => {
      state.main = document.querySelector(`#${state.id} .ant-table-body`)
      state.queryTableAttribute()
      state.main?.addEventListener('scroll', state.handleScroll)
    }, 1000)
  }
})

onBeforeUnmount(() => {
  state.main?.removeEventListener('scroll', state.handleScroll)
})

onMounted(() => {
  state.handleLoad()
  state.handleBindScroll()
})
</script>

<style scoped lang="less"></style>
