<template>
  <div :id="state.id" class="w-full" :style="`height: ${height}`"></div>
</template>

<script setup lang="ts" name="BaseLine">
import * as echarts from 'echarts'
import { v4 as uuid } from 'uuid'

let myChart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

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
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
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
    // 监听元素尺寸变化
    resizeObserver = new ResizeObserver(() => state.resizeChart())
    resizeObserver.observe(chartDom)
  }
  window.addEventListener('resize', state.resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', state.resizeChart)
  if (resizeObserver) {
    const chartDom = document.getElementById(state.id)
    if (chartDom) resizeObserver.unobserve(chartDom)
    resizeObserver.disconnect()
    resizeObserver = null
  }
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
