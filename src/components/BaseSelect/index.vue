<template>
  <a-select
    v-model:value="state.value"
    :placeholder="placeholder"
    :fieldNames="fieldNames"
    :options="state.options"
    v-bind="state.selectProps"
    @change="state.handleChange"
  />
</template>

<script setup lang="ts" name="BaseSelect">
import type { SelectProps } from 'ant-design-vue'
import { useAppStore } from '@/store'
import { fetch } from '@/utils/request'

interface StateType {
  value: string | number | Array<any> | undefined
  options: Array<any>
  selectProps: SelectProps
  handleChange: (_value: any, _option: any) => void
}

const props = defineProps({
  value: {
    type: [String, Number, Array],
    default: ''
  },
  mode: {
    type: String as () => SelectProps['mode'],
    default: undefined
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  dict: {
    type: String,
    default: ''
  },
  api: {
    type: String,
    default: ''
  },
  params: {
    type: Object,
    default: () => ({})
  },
  options: {
    type: Array,
    default: () => {
      return []
    }
  },
  fieldNames: {
    type: Object,
    default: () => {
      return { label: 'label', value: 'value', options: 'options' }
    }
  }
})

const emit = defineEmits(['update:value', 'select'])
const appStore = useAppStore()
const { dictData } = toRefs(appStore)

const state = reactive<StateType>({
  value: undefined,
  options: [],
  selectProps: {
    allowClear: true,
    maxTagCount: 2,
    mode: props.mode,
    showArrow: true,
    showSearch: true
  },
  handleChange(value: any, option: any) {
    emit('update:value', value)
    emit('select', { value, option })
  }
})

onMounted(async () => {
  // 如果传入了dict，则从store的dictData中获取对应的数据作为选项
  if (props.dict && dictData.value[props.dict]) {
    state.options = dictData.value[props.dict] as Array<any>
  } else if (props.api) {
    // 如果传入了api，则调用对应的接口获取数据作为选项
    const { code, data } = await fetch(props.api, props.params)
    if (code === 200) {
      state.options = data
    }
  } else {
    // 否则使用传入的options作为选项
    state.options = props.options
  }
})

watch(
  () => props.value,
  newVal => {
    state.value = newVal || undefined
  },
  { immediate: true }
)
</script>
