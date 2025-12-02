<template>
  <div :id="state.id" class="w-full" :style="`height: ${height}`"></div>
</template>

<script setup lang="ts" name="BaseLine">
import * as echarts from 'echarts'
import { v4 as uuid } from 'uuid'

let myChart: echarts.ECharts | null = null

const props = defineProps({
  data: {
    type: Array,
    default: () => {
      return [120, 132, 101, 134, 90, 230, 210]
    }
  },
  series: {
    type: Object,
    default: () => ({})
  },
  height: {
    type: String,
    default: '300px'
  }
})

const state = reactive({
  id: 'echarts-' + uuid(),
  option: {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total', // 数据堆叠
        smooth: true, // 平滑曲线
        data: props.data
      }
    ]
  },
  // 调整图表尺寸方法
  resizeChart() {
    if (myChart) myChart.resize()
  }
})

onMounted(() => {
  const chartDom = document.getElementById(state.id)
  if (chartDom) {
    myChart = echarts.init(chartDom)
    myChart.setOption(state.option)
  }
  // 窗口大小变化时，自动调整图表尺寸
  window.addEventListener('resize', state.resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', state.resizeChart)
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
})

watch(
  () => props.data,
  newData => {
    if (myChart) {
      myChart.setOption({
        series: [
          {
            data: newData
          }
        ]
      })
    }
  },
  { deep: true }
)
</script>
