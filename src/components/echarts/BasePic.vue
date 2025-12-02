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
  height: {
    type: String,
    default: '300px'
  }
})

const state = reactive({
  // 组件响应式状态
  id: 'echarts-' + uuid(),
  myChart: null as echarts.ECharts | null,
  option: {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      button: '1%',
      left: 'left'
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
    if (state.myChart) state.myChart.resize()
  }
})

onMounted(() => {
  const chartDom = document.getElementById(state.id)
  state.myChart = echarts.init(chartDom)
  state.myChart.setOption(state.option)
  // 窗口大小变化时，自动调整图表尺寸
  window.addEventListener('resize', state.resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', state.resizeChart)
  if (state.myChart) {
    state.myChart.dispose()
    state.myChart = null
  }
})

watch(
  () => props.data,
  newData => {
    if (state.myChart) {
      state.myChart.setOption({
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
