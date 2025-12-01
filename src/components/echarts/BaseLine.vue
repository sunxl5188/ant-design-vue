<template>
	<div :id="id" class="myEchart"></div>
</template>

<script setup lang="ts" name="BaseLine">
import * as echarts from 'echarts'
import { v4 as uuid } from 'uuid'
import dayjs from 'dayjs'

const id = 'echart' + uuid

const generateData = () => {
	const data: any[] = []
	for (let i = 1; i < 10; i++) {
		data.push([
			dayjs().add(i, 'day').format('YYYY-MM-DD'),
			Math.round(Math.random() * 100)
		])
	}
	return data
}

const option = {
	xAxis: {
		type: 'time',
		axisLabel: {
			showMinLabel: true,
			showMaxLabel: true,
			formatter: '{MM}-{dd}'
		}
		//data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
	},
	yAxis: {
		type: 'value'
	},
	series: [
		{
			data: generateData(),
			type: 'line'
		}
	]
}
onMounted(() => {
	const chartDom = document.getElementById(id)
	const myChart = echarts.init(chartDom)
	myChart.setOption(option)
})
</script>

<style scoped lang="less">
.myEchart {
	width: 100%;
	height: 300px;
}
</style>
