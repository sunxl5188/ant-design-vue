<template>
  <div :id="state.id" class="w-full" :style="`height: ${height}`"></div>
</template>

<script setup lang="ts" name="BaseBar">
import { v4 as uuid } from 'uuid'
import * as echarts from 'echarts'

let myChart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const props = defineProps({
  data: {
    type: Array,
    default: () => {
      return [120, 200, 150, 80, 70, 110, 130]
    }
  },
  series: {
    type: Object,
    default: () => ({})
  },
  color: {
    type: Array as () => string[],
    default: () => [
      '#5470c6',
      '#91cc75',
      '#fac858',
      '#ee6666',
      '#73c0de',
      '#3ba272',
      '#fc8452',
      '#9a60b4',
      '#ea7ccc'
    ]
  },
  height: {
    type: String,
    default: '300px'
  },
  xAxis: {
    type: Array,
    default: () => []
  }
})

const state = reactive({
  id: 'echarts-' + uuid(),
  option: {
    color: props.color,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: {
        lineStyle: {
          color: '#d1d5db'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        color: '#4E5969',
        lineStyle: {
          color: '#E5E6EB',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: '#E5E6EB',
          type: 'dashed'
        }
      }
    },
    grid: {
      left: '10%',
      right: '4%',
      top: '10%',
      bottom: '15%'
    },
    series: [
      {
        name: '',
        type: 'bar',
        barMaxWidth: 55,
        // barMinWidth: 30,
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        data: props.data,
        ...props.series
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
})

watch(
  () => props.data,
  () => {
    if (myChart) {
      myChart.setOption({
        series: [
          {
            data: props.data
          }
        ]
      })
    }
  },
  { deep: true }
)
</script>
