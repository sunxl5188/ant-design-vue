<template>
  <div
    class="base-search overflow-hidden ease-out duration-300"
    :style="form.searchStyle"
  >
    <!-- 这块是为了计算高度，不显示 -->
    <a-row :gutter="[16, 0]" class="fixed -z-10 -top-full">
      <a-col
        v-for="(item, i) in formItem"
        :key="i"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xxl="6"
      >
        <a-form-item>
          <a-input />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :sm="12" :md="8" :lg="6" :xxl="6">
        <a-form-item>
          <a-input />
        </a-form-item>
      </a-col>
    </a-row>
    <a-form
      :model="formData"
      autocomplete="off"
      scrollToFirstError
      class="flex-1"
    >
      <a-row :gutter="[16, 0]">
        <a-col
          v-for="(item, i) in form.getFormItem"
          :key="i"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xxl="6"
        >
          <a-form-item>
            <a-input
              v-if="!item.type || item.type === 'input'"
              v-model:value="formData[item.prop]"
              :placeholder="item.placeholder || $t('a.a17', [item.label])"
              allowClear
              :max-length="50"
            />
            <BaseSelect
              v-if="item.type === 'select'"
              v-model:value="formData[item.prop]"
              :placeholder="item.placeholder || $t('a.a18', [item.label])"
              :options="item.options || undefined"
              :dict="item.dict"
              :api="item.api"
              :params="item.params || {}"
              :fieldNames="item.fieldNames || undefined"
              :mode="item.multiple ? 'multiple' : undefined"
            />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="6" :xxl="6">
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="handleSearch">
                <template #icon><SearchOutlined /></template>
                {{ $t('a.a13') }}
              </a-button>
              <a-button @click="handleReset">
                <template #icon>
                  <DeleteOutlined />
                </template>
                {{ $t('a.a14') }}
              </a-button>
              <div
                v-if="form.collapsedShow"
                class="button-collapsed"
                @click="isCollapsed = !isCollapsed"
              >
                <div>{{ isCollapsed ? $t('a.a15') : $t('a.a16') }}</div>
                <DownOutlined
                  class="transition-all"
                  :class="{ 'rotate-180': isCollapsed }"
                />
              </div>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts" name="BaseSearch">
import type { SelectProps } from 'ant-design-vue'
import { useAppStore } from '@/store'
import BaseSelect from '../BaseSelect'
import { slice } from 'lodash-es'

type valueType = string | number | undefined | Array<any>
interface FormItemType {
  label: string
  prop: string
  value: valueType
  type?: string
  placeholder?: string
  options?: SelectProps['options']
  dict?: string
  api?: string
  params?: Record<string, any>
  fieldNames?: Record<string, string>
  multiple?: boolean
}

interface PropsType {
  formItem: FormItemType[]
}

const props = withDefaults(defineProps<PropsType>(), {
  formItem: () => {
    return []
  }
})

let resizeObserver: ResizeObserver | null = null
const appStore = useAppStore()
const { themeToken } = toRefs(appStore)
const defaultForm: Record<string, valueType> = {}
const emit = defineEmits(['search'])

const form = reactive({
  isCollapsed: false,
  collapsedShow: false,
  endIndex: 0,
  boxHeight: 0,
  docHeight: 0,
  formData: { ...defaultForm },
  getFormItem: computed((): FormItemType[] => {
    return form.isCollapsed
      ? props.formItem
      : slice(props.formItem, 0, form.endIndex)
  }),
  searchStyle: computed(() => {
    let style = ''
    if(form.collapsedShow) {
      style = form.isCollapsed ? `height: ${form.boxHeight}px` : `height: ${form.docHeight}px`
    }
    return style
  }),
  //提交数据
  handleSearch() {
    emit('search', form.formData)
  },
  //重置表单
  handleReset() {
    form.formData = { ...defaultForm }
    form.handleSearch()
  },
  //监听表单宽度变化
  handleResize() {
    setTimeout(() => {
      const len = props.formItem.length
      const rowDom: any = document.querySelector('.base-search .ant-row')
      const colDom: any = document.querySelector('.base-search .ant-col')
      if(!rowDom || !colDom) return
      const colHeight = colDom?.offsetHeight || 44
      const rowCol = Math.round(rowDom.offsetWidth / colDom.offsetWidth)
      form.boxHeight = rowDom.offsetHeight
      form.docHeight = colHeight * 2
      form.endIndex = rowCol * 2 - 1
      form.collapsedShow = len > form.endIndex
    }, 300)
  }
})

onMounted(() => {
  props.formItem.forEach(item => {
    defaultForm[item.prop] = item.value || undefined
  })
  form.formData = { ...defaultForm }
  //监听元素尺寸变化
  form.handleResize()
  resizeObserver = new ResizeObserver(() => {
    form.handleResize()
  })
  resizeObserver.observe(document.querySelector('.base-search') as Element)
})

//卸载时取消监听
onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.unobserve(document.querySelector('.base-search') as Element)
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

const { isCollapsed, formData, handleSearch, handleReset } = toRefs(form)
</script>

<style lang="less" scoped>
.button-collapsed {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: v-bind('themeToken.colorPrimary');
  user-select: none;
}
:deep(.ant-form-item) {
  margin-bottom: 12px;
}
</style>
