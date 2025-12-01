<template>
  <a-card>
    <a-row align="top" type="flex" justify="space-between">
      <a-col>
        <a-space>
          <a-avatar :size="64" shape="circle" :src="userInfo.avatar" />
          <a-space direction="vertical" :size="2">
            <div class="text-base font-black">
              早安， {{ userInfo.nickName }}，祝你开心每一天！
            </div>
            <div class="text-gray-500">
              蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED
            </div>
          </a-space>
        </a-space>
      </a-col>
      <a-col>
        <a-space size="large">
          <a-space direction="vertical" :size="4" align="center">
            <span class="text-base text-gray-500">项目数</span>
            <span class="text-2xl font-sans">56</span>
          </a-space>
          <a-divider type="vertical" class="h-10" />
          <a-space direction="vertical" :size="4" align="center">
            <span class="text-base text-gray-500">团队内排名</span>
            <span class="text-2xl font-sans">8/24</span>
          </a-space>
          <a-divider type="vertical" class="h-10" />
          <a-space direction="vertical" :size="4" align="center">
            <span class="text-base text-gray-500">项目访问</span>
            <span class="text-2xl font-sans">2,223</span>
          </a-space>
        </a-space>
      </a-col>
    </a-row>
  </a-card>
  <div class="h-3"></div>
  <a-row :gutter="12">
    <a-col :md="16" :sm="24" :xs="24">
      <a-card title="进行中的项目">
        <a-card-grid v-for="(item, i) in projectList" :key="i" class="w-4/12">
          <a-card-meta>
            <template #title>
              <a-avatar :size="22" shape="circle" :src="item.url" />
              <span class="ml-2">{{ item.title }}</span>
            </template>
            <template #description>
              <div class="text-sm text-gray-700 py-2">
                {{ item.desc }}
              </div>
            </template>
          </a-card-meta>
          <div
            class="flex justify-between items-center text-xs mt-4 text-gray-500"
          >
            <div>科学搬砖组</div>
            <div>9小时前</div>
          </div>
        </a-card-grid>
      </a-card>
      <div class="h-3"></div>
      <a-card title="动态">
        <a-list
          :loading="false"
          item-layout="horizontal"
          :data-source="dynamicList"
          :pagination="false"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta>
                <template #title>
                  <span class="font-normal text-sm">
                    <span class="text-primary">{{ item.username }}</span>
                    <span>在</span>
                    <span class="text-primary">{{ item.company }}</span>
                    <span>{{ item.event }}</span>
                    <span class="text-primary">{{ item.project }}</span>
                  </span>
                </template>
                <template #avatar>
                  <a-avatar :src="item.avatar" />
                </template>
                <template #description>{{ item.desc }}</template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
    </a-col>
    <a-col :md="8" :sm="24" :xs="24">
      <a-card title="指数">
        <BasePic />
      </a-card>
      <div class="h-3"></div>
      <a-card title="团队">
        <a-row>
          <a-col :span="12" v-for="(item, i) in teamList" :key="i">
            <div class="leading-10">
              <a-avatar :size="22" shape="circle" :src="item.url" />
              <span class="ml-1">{{ item.title }}</span>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup lang="ts" name="Workplace">
import { useUserStore } from '@/store'
import { BasePic } from '@/components/echarts'

const userStore = useUserStore()
const { userInfo } = userStore

function shuffle(arr: any[]) {
  return arr.sort(() => Math.random() - 0.5)
}

const projectList = ref(
  shuffle([
    {
      title: 'Alipay',
      desc: '那是一种内在的东西，他们到达不了，也无法触及的',
      url: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png'
    },
    {
      title: 'Angular',
      desc: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
      url: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png'
    },
    {
      title: 'Ant Design',
      desc: '生命就像一盒巧克力，结果往往出人意料',
      url: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png'
    },
    {
      title: 'Ant Design Pro',
      desc: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
      url: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png'
    },
    {
      title: 'Bootstrap',
      desc: '那时候我只会想自己想要什么，从不想自己拥有什么',
      url: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png'
    },
    {
      title: 'React',
      desc: '生命就像一盒巧克力，结果往往出人意料',
      url: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png'
    }
  ])
)

const dynamicList = ref(
  shuffle([
    {
      avatar:
        'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      username: '曲丽丽',
      company: '高逼格设计天团',
      event: '新建项目',
      time: '2018-08-26 20:00',
      project: '六月迭代',
      desc: '那是一种内在的东西，他们到达不了，也无法触及的'
    },
    {
      avatar:
        'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
      username: '付小小',
      company: '高逼格设计天团',
      event: '新建项目',
      time: '2018-08-26 20:00',
      project: '六月迭代',
      desc: '希望是一个好东西，也许是最好的，好东西是不会消亡的'
    },
    {
      avatar:
        'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
      username: '林东东',
      company: '中二少女团',
      event: '添加成员',
      time: '2018-08-26 20:00',
      project: '六月迭代',
      desc: '生命就像一盒巧克力，结果往往出人意料'
    },
    {
      avatar:
        'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
      username: '周星星',
      company: '程序员日常',
      event: '更新项目',
      time: '2018-08-26 20:00',
      project: '六月迭代',
      desc: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆'
    }
  ])
)

const teamList = ref(
  shuffle([
    {
      title: '科学搬砖组',
      url: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png'
    },
    {
      title: '程序员日常',
      url: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png'
    },
    {
      title: '设计天团',
      url: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png'
    },
    {
      title: '产品小分队',
      url: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png'
    },
    {
      title: '蚂蚁金服',
      url: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png'
    },
    {
      title: '中二少女团',
      url: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png'
    }
  ])
)
</script>

<style lang="less" scoped></style>
