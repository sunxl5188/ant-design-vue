<template>
  <a-row :gutter="[16, 16]" class="mb-4">
    <a-col
      v-for="(item, i) in state.cardList"
      :key="i"
      :xs="24"
      :sm="12"
      :md="12"
      :lg="8"
      :xl="6"
      :xxl="6"
    >
      <a-card :bodyStyle="{ padding: '0' }">
        <div class="p-4">
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-600">{{ item.title }}</div>
            <div>
              <BaseTip :title="item.tooltip">
                <QuestionCircleOutlined class="text-gray-400" />
              </BaseTip>
            </div>
          </div>
          <div class="text-3xl">{{ item.total }}</div>
          <div class="h-32 pt-4 flex justify-center items-center">
            <BaseLine v-if="i === 0" height="120px" :data="item.chartData" />
            <BaseBar v-if="i === 1" height="120px" :data="item.chartData" />
            <BasePic
              v-if="i === 2"
              height="120px"
              :data="item.chartData"
              :series="state.series"
              :legend="{ show: false }"
            />
            <a-progress
              v-if="i === 3"
              type="dashboard"
              :percent="78"
              :size="120"
            />
          </div>
        </div>
        <div
          class="text-sm text-gray-500 px-4 py-3 border-t border-solid border-gray-100"
        >
          {{ item.footer }}
        </div>
      </a-card>
    </a-col>
  </a-row>

  <a-card
    :tabList="state.tabList"
    @tabChange="state.handleTabChange"
    class="mb-4"
  >
    <template #tabBarExtraContent>
      <a-space>
        <a-button
          v-for="(item, i) in state.dateType"
          :key="i"
          :type="item.value === state.activeDate ? 'primary' : 'text'"
          @click="state.handleSelectDate(item)"
        >
          {{ item.label }}
        </a-button>
        <a-range-picker
          v-model:value="state.day"
          :placeholder="['开始日期', '结束日期']"
          value-format="YYYY-MM-DD"
          :disabledDate="(current: Date) => current && current > new Date()"
        />
      </a-space>
    </template>
    <template v-if="state.active === 'sales'">
      <a-row>
        <a-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
          <div class="text-sm mb-3">销售趋势</div>
          <BaseBar
            :data="[820, 732, 701, 734, 1090, 1130, 1120, 980, 860, 720]"
            height="320px"
            :series="{ barMaxWidth: 35 }"
          />
        </a-col>
        <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <div class="text-sm mb-3">门店销售额排名</div>
          <ul>
            <li
              v-for="(item, i) in state.salesList"
              :key="i"
              class="flex justify-between items-center leading-8"
            >
              <span
                class="inline-block rounded-full w-5 h-5 text-center mr-2 text-xs leading-5"
                :class="[
                  { 'bg-red-500 text-white': i === 0 },
                  { 'bg-gray-700 text-white': i > 0 && i < 3 },
                  { 'bg-gray-200 text-base': i >= 3 }
                ]"
              >
                {{ i + 1 }}
              </span>
              <span class="flex-1">{{ item.title }}</span>
              <span class="font-serif">{{ item.total }}</span>
            </li>
          </ul>
        </a-col>
      </a-row>
    </template>
    <template v-if="state.active === 'views'">
      <a-row>
        <a-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
          <div class="text-sm mb-3">访问量趋势</div>
          <BaseBar
            :data="[400, 380, 350, 320, 300, 280, 260, 240, 220, 200]"
            :series="{ barMaxWidth: 35 }"
            :color="['#fac858']"
            height="320px"
          />
        </a-col>
        <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <div class="text-sm mb-3">门店访问量排名</div>
          <ul>
            <li
              v-for="(item, i) in state.visitList"
              :key="i"
              class="flex justify-between items-center leading-8"
            >
              <span
                class="inline-block rounded-full w-5 h-5 text-center mr-2 text-xs leading-5"
                :class="[
                  { 'bg-red-500 text-white': i === 0 },
                  { 'bg-gray-700 text-white': i > 0 && i < 3 },
                  { 'bg-gray-200 text-base': i >= 3 }
                ]"
              >
                {{ i + 1 }}
              </span>
              <span class="flex-1">{{ item.title }}</span>
              <span class="font-serif">{{ item.total }}</span>
            </li>
          </ul>
        </a-col>
      </a-row>
    </template>
  </a-card>
  <a-row :gutter="[16, 16]" type="flex" align="stretch">
    <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
      <a-card title="线上热门搜索" class="h-full">
        <a-row class="mb-4">
          <a-col :span="12">
            <div class="flex justify-start items-center mb-4">
              <div class="text-sm text-gray-500">搜索用户数</div>
              <BaseTip class="ml-2" title="搜索用户数">
                <QuestionCircleOutlined class="text-gray-400" />
              </BaseTip>
            </div>
            <BaseLine height="140px" />
          </a-col>
          <a-col :span="12">
            <div class="flex justify-start items-center mb-4">
              <div class="text-sm text-gray-500">搜索用户数</div>
              <BaseTip class="ml-2" title="搜索用户数">
                <QuestionCircleOutlined class="text-gray-400" />
              </BaseTip>
            </div>
            <BaseLine height="140px" />
          </a-col>
        </a-row>
        <BaseTable
          :loading="loading"
          :dataSource="dataSource"
          :columns="columns"
          :pagination="{ pageSize: 5 }"
          :attr="{
            size: 'small'
          }"
        >
          <template #bodyCell="{ text, record, column: { dataIndex } }">
            <template v-if="dataIndex === 'weekGrowth'">
              <span>{{ text }}</span>
              <CaretUpOutlined
                v-if="record.weekStatus === 1"
                class="text-red-500"
              />
              <CaretDownOutlined v-else class="text-green-500" />
            </template>
          </template>
        </BaseTable>
      </a-card>
    </a-col>
    <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
      <a-card title="销售额类别占比" class="h-full">
        <template #extra>
          <a-radio-group v-model:value="state.salesType">
            <a-radio-button value="1">全部</a-radio-button>
            <a-radio-button value="2">线上</a-radio-button>
            <a-radio-button value="3">门店</a-radio-button>
          </a-radio-group>
        </template>
        <div class="flex justify-start items-center mb-4">
          <div class="text-sm text-gray-500">销售额</div>
          <BaseTip class="ml-2" title="销售额" />
        </div>
        <BasePic
          height="400px"
          :color="[
            '#5470c6',
            '#91cc75',
            '#fac858',
            '#ee6666',
            '#73c0de',
            '#3ba272'
          ]"
          :data="state.picData"
          :series="state.picSeries"
          :legend="state.picLegend"
        />
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup lang="ts" name="AnalysisPage">
import BaseTip from '@/components/BaseTip'
import { BaseLine, BaseBar, BasePic } from '@/components/echarts'
import BaseTable from '@/components/BaseTable'
import dayjs from 'dayjs'

const state = reactive({
  cardList: [
    {
      title: '总销售额',
      tooltip: '指标说明',
      total: '￥126,560',
      footer: '日销售额 ￥12,423',
      chartData: [20, 30, 15, 10, 5, 30, 22]
    },
    {
      title: '访问量',
      tooltip: '指标说明',
      total: '8,846',
      footer: '日访问量 1,234',
      chartData: [120, 200, 150, 80, 70, 110, 130]
    },
    {
      title: '支付笔数',
      tooltip: '指标说明',
      total: '6,560',
      footer: '转化率 60%',
      chartData: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    },
    {
      title: '运营活动效果',
      tooltip: '指标说明',
      total: '78%',
      footer: '周同比12%，日同比11%',
      chartData: []
    }
  ],
  series: {
    name: '',
    radius: ['50%', '100%'],
    center: ['50%', '80%'],
    startAngle: 180,
    endAngle: 360,
    emphasis: {
      label: {
        show: true,
        fontSize: 16
      }
    }
  },
  tabList: [
    { key: 'sales', tab: '销售额' },
    { key: 'views', tab: '访问量' }
  ],
  active: 'sales',
  handleTabChange(key: string) {
    state.active = key
  },
  //门店销售额排名
  salesList: [
    { title: '北京旗舰店', total: '￥ 323,234' },
    { title: '上海专卖店', total: '￥ 293,234' },
    { title: '广州品牌店', total: '￥ 273,234' },
    { title: '深圳体验店', total: '￥ 263,234' },
    { title: '杭州直营店', total: '￥ 253,234' },
    { title: '成都旗舰店', total: '￥ 243,234' },
    { title: '南京专卖店', total: '￥ 233,234' },
    { title: '武汉品牌店', total: '￥ 223,234' },
    { title: '西安体验店', total: '￥ 213,234' },
    { title: '青岛直营店', total: '￥ 203,234' }
  ],
  // 门店访问排名
  visitList: [
    { title: '北京旗舰店', total: '8,234' },
    { title: '上海专卖店', total: '7,934' },
    { title: '广州品牌店', total: '7,534' },
    { title: '深圳体验店', total: '7,234' },
    { title: '杭州直营店', total: '6,934' },
    { title: '成都旗舰店', total: '6,534' },
    { title: '南京专卖店', total: '6,234' },
    { title: '武汉品牌店', total: '5,934' },
    { title: '西安体验店', total: '5,634' },
    { title: '青岛直营店', total: '5,334' }
  ],
  activeDate: 'today',
  dateType: [
    { label: '今日', value: 'today' },
    { label: '本周', value: 'week' },
    { label: '本月', value: 'month' },
    { label: '近三个月', value: 'quarter' }
  ],
  day: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
  handleSelectDate(item: { label: string; value: string }) {
    state.activeDate = item.value
    const today = dayjs()
    let startDate = today
    let endDate = today
    switch (item.value) {
      case 'week':
        startDate = today.startOf('week')
        break
      case 'month':
        startDate = today.startOf('month')
        break
      case 'quarter':
        startDate = today.subtract(3, 'month').startOf('month')
        break
      default:
        startDate = today
        endDate = today
        break
    }
    state.day = [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
  },
  salesType: '1',
  picSeries: {
    radius: ['0%', '80%'],
    center: ['50%', '50%'],
    emphasis: {
      label: {
        show: true,
        fontSize: 16
      }
    }
  },
  picLegend: {
    orient: 'vertical',
    left: '6%',
    top: 'middle',
    itemGap: 20
  },
  picData: computed(() => {
    // 随机生成 value
    const random = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min
    let data: any = []
    if (state.salesType === '1') {
      data = [
        { value: random(800, 1500), name: '家用电器' },
        { value: random(500, 1000), name: '食用酒水' },
        { value: random(400, 900), name: '个护健康' },
        { value: random(300, 700), name: '服饰箱包' },
        { value: random(200, 600), name: '母婴产品' },
        { value: random(100, 500), name: '其他' }
      ]
    }
    if (state.salesType === '2') {
      data = [
        { value: random(50, 200), name: '家用电器' },
        { value: random(300, 600), name: '食用酒水' },
        { value: random(400, 700), name: '个护健康' },
        { value: random(30, 200), name: '服饰箱包' },
        { value: random(200, 500), name: '母婴产品' },
        { value: random(100, 400), name: '其他' }
      ]
    }
    if (state.salesType === '3') {
      data = [
        { value: random(800, 1200), name: '家用电器' },
        { value: random(500, 900), name: '食用酒水' },
        { value: random(400, 800), name: '个护健康' },
        { value: random(300, 700), name: '服饰箱包' },
        { value: random(200, 600), name: '母婴产品' },
        { value: random(100, 500), name: '其他' }
      ]
    }
    return data
  })
})

const table = reactive({
  loading: false,
  dataSource: [
    {
      rank: 1,
      keyword: '',
      userNum: 1234,
      weekGrowth: '12%',
      weekStatus: 1
    },
    {
      rank: 2,
      keyword: 'Ant Design Vue',
      userNum: 1100,
      weekGrowth: '10%',
      weekStatus: 2
    },
    {
      rank: 3,
      keyword: 'ECharts 图表',
      userNum: 980,
      weekGrowth: '9%',
      weekStatus: 1
    },
    {
      rank: 4,
      keyword: 'Pinia 状态管理',
      userNum: 900,
      weekGrowth: '8%',
      weekStatus: 2
    },
    {
      rank: 5,
      keyword: 'Vite 配置',
      userNum: 850,
      weekGrowth: '7%',
      weekStatus: 1
    },
    {
      rank: 6,
      keyword: 'TypeScript 入门',
      userNum: 800,
      weekGrowth: '7%',
      weekStatus: 2
    },
    {
      rank: 7,
      keyword: '前端性能优化',
      userNum: 780,
      weekGrowth: '6%',
      weekStatus: 1
    },
    {
      rank: 8,
      keyword: 'SVG 图标',
      userNum: 760,
      weekGrowth: '6%',
      weekStatus: 2
    },
    {
      rank: 9,
      keyword: '动态主题切换',
      userNum: 740,
      weekGrowth: '5%',
      weekStatus: 1
    },
    {
      rank: 10,
      keyword: '自动导入',
      userNum: 700,
      weekGrowth: '5%',
      weekStatus: 2
    },
    {
      rank: 11,
      keyword: '国际化 i18n',
      userNum: 680,
      weekGrowth: '4%',
      weekStatus: 1
    },
    {
      rank: 12,
      keyword: '项目脚手架',
      userNum: 650,
      weekGrowth: '4%',
      weekStatus: 2
    },
    {
      rank: 13,
      keyword: '路由动态添加',
      userNum: 630,
      weekGrowth: '4%',
      weekStatus: 1
    },
    {
      rank: 14,
      keyword: '递归菜单渲染',
      userNum: 600,
      weekGrowth: '3%',
      weekStatus: 2
    },
    {
      rank: 15,
      keyword: '响应式布局',
      userNum: 580,
      weekGrowth: '3%',
      weekStatus: 1
    },
    {
      rank: 16,
      keyword: 'Mock 数据',
      userNum: 560,
      weekGrowth: '3%',
      weekStatus: 2
    },
    {
      rank: 17,
      keyword: '表单校验',
      userNum: 540,
      weekGrowth: '2%',
      weekStatus: 1
    },
    {
      rank: 18,
      keyword: '权限控制',
      userNum: 520,
      weekGrowth: '2%',
      weekStatus: 2
    },
    {
      rank: 19,
      keyword: '多环境配置',
      userNum: 500,
      weekGrowth: '2%',
      weekStatus: 1
    },
    {
      rank: 20,
      keyword: '打包优化',
      userNum: 480,
      weekGrowth: '1%',
      weekStatus: 2
    }
  ],
  columns: [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      align: 'center' as const
    },
    {
      title: '搜索关键词',
      dataIndex: 'keyword'
    },
    {
      title: '用户数',
      dataIndex: 'userNum',
      align: 'center' as const,
      sorter: (a: any, b: any) => a.userNum - b.userNum
    },
    {
      title: '周涨幅',
      dataIndex: 'weekGrowth',
      align: 'center' as const,
      sorter: (a: any, b: any) =>
        parseFloat(a.weekGrowth) - parseFloat(b.weekGrowth)
    }
  ]
})

const { loading, dataSource, columns } = toRefs(table)
</script>
