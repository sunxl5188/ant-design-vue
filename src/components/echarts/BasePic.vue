<template>
  <div :id="state.id" class="w-full" :style="`height: ${height}`"></div>
</template>
<!-- ECharts 渲染的 DOM 节点，id 保证唯一 -->
<script setup lang="ts" name="BasePic">
import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { v4 as uuid } from 'uuid'

// 引入 ECharts 相关模块
echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
])

let myChart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const props = defineProps({
  data: {
    type: Array,
    default: () => {
      return [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  },
  series: {
    type: Object,
    default: () => ({})
  },
  legend: {
    type: Object,
    default: () => ({})
  },
  tooltip: {
    type: Object,
    default: () => ({})
  },
  grid: {
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
  }
})

const state = reactive({
  // 组件响应式状态
  id: 'echarts-' + uuid(),
  option: {
    color: props.color,
    tooltip: {
      trigger: 'item',
      ...props.tooltip
    },
    legend: {
      orient: 'horizontal',
      button: '1%',
      left: 'left',
      ...props.legend
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '10%',
      bottom: '10%',
      ...props.grid
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '40%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 30,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: props.data,
        ...props.series
      }
    ]
  },
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
