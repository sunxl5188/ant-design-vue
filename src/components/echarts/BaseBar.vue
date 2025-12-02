<template>
  <div :id="state.id" class="w-full" :style="`height: ${height}`"></div>
</template>

<script setup lang="ts" name="BaseBar">
import { v4 as uuid } from 'uuid'
import * as echarts from 'echarts'

let myChart: echarts.ECharts | null = null

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
    type: Array,
    default: () => {
      return []
    }
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
    color: ['#3398DB'],
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
      top: '15%',
      bottom: '15%'
    },
    series: [
      {
        name: '',
        type: 'bar',
        barMaxWidth: 55,
        barMinWidth: 30,
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        itemStyle: {
          borderRadius: [8, 8, 0, 0]
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
  }
  window.addEventListener('resize', state.resizeChart)
})

onBeforeMount(() => {
  window.removeEventListener('resize', state.resizeChart)
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
