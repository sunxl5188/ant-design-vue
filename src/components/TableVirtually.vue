<template>
	<a-table
		:id="state.id"
		ref="tableRef"
		v-bind="state.tableAttribute"
		class="virtual"
	>
		<template #bodyCell="{ text, record, column }">
			<slot name="bodyCell" :text="text" :record="record" :column="column" />
		</template>
	</a-table>
</template>

<script setup name="TableVirtually">
import { v4 as uuid } from 'uuid'
const tableRef = ref()
const tableList = ref()

const props = defineProps({
	screenHeight: { type: Number, default: 500 } //可视区域高度
})

const state = reactive({
	id: `table-${uuid()}`,
	loading: false,
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
	initData: [], //所有数据
	itemHeight: 55, //每列高度
	startOffset: '', //偏移量
	start: 0, //起始索引
	end: null, //结束索引
	list: computed(() => {
		return state.initData.slice(state.start, state.end)
	}),
	computedVisibleCount: computed(() => {
		return Math.ceil(props.screenHeight / state.itemHeight) + 1
	}),
	scrollEvent: ({ target }) => {
		//当前滚动位置
		let scrollTop = target.scrollTop
		//此时的开始索引
		state.start = Math.floor(scrollTop / state.itemHeight)
		//此时的结束索引
		state.end = state.start + 20
		//此时的偏移量
		state.startOffset = `translate3d(0,${
			scrollTop - (scrollTop % state.itemHeight)
		}px,0)`
		tableList.value.style.transform = state.startOffset
	},
	init: () => {
		state.start = 0
		state.end = state.computedVisibleCount
		setTimeout(() => {
			const div = document.createElement('div')
			div.style = `height:${state.initData.length * state.itemHeight}px;position: absolute;z-index: 1;width:100%`
			div.className = 'virtual-scroll'
			const tabBody = document.querySelector(`#${state.id} .ant-table-body`)
			tabBody.style.height = `${props.screenHeight}px`
			tableList.value = document.querySelector(
				`#${state.id} .ant-table-body table`
			)
			state.itemHeight =
				document.querySelector(
					`#${state.id} .ant-table-body table .ant-table-row`
				).offsetHeight || 54

			tabBody.append(div)
			tabBody.addEventListener('scroll', e => {
				/* window.requestAnimationFrame(() => {
				state.scrollEvent(e)
			}) */
				state.scrollEvent(e)
			})
		}, 1000)
	},
	tableAttribute: computed(() => {
		return {
			loading: state.loading,
			columns: state.columns,
			dataSource: state.list,
			rowKey: record => record.id,
			pagination: false,
			scroll: { y: state.itemHeight * state.end }
		}
	})
})

onMounted(() => {
	for (let i = 0; i < 100; i++) {
		state.initData.push({
			id: `${i + 1}`,
			buyerName: 'JJJLin',
			addressDetail: '小区1测试单元3302室',
			gender: '女',
			age: 23,
			address: `福建省厦门市思明区筼筜街道仙岳路${i + 1}号翔业大厦`,
			visitTimeType: '8',
			stationName: '测试驿站'
		})
	}
	state.init()
})
</script>

<style lang="less" scoped>
.virtual {
	::v-deep(.ant-table) {
		.ant-table-body {
			position: relative;
			& table {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				z-index: 10;
			}
		}
	}
}
</style>
