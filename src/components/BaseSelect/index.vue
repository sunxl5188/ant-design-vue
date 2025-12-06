<template>
  <a-select
    v-model:value="state.value"
    :placeholder="placeholder"
    :fieldNames="fieldNames"
    :options="options"
    v-bind="state.selectProps"
    @change="state.handleChange"
  />
</template>

<script setup lang="ts" name="BaseSelect">
import type { SelectProps } from 'ant-design-vue'
import { useAppStore } from '@/store'

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
      return [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
        { label: '选项3', value: 'option3' },
        { label: '选项4', value: 'option4' },
        { label: '选项5', value: 'option5' },
        { label: '选项6', value: 'option6' },
        { label: '选项7', value: 'option7' },
        { label: '选项8', value: 'option8' },
        { label: '选项9', value: 'option9' },
        { label: '选项10', value: 'option10' }
      ]
    }
  },
  fieldNames: {
    type: Object,
    default: () => {
      return { label: 'label', value: 'value', options: 'options' }
    }
  }
})

const emit = defineEmits(['update:value'])
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
    console.log('select value:', value)
    console.log('select option:', option)
    emit('update:value', value)
  }
})

onMounted(() => {
  // 如果传入了dict，则从store的dictData中获取对应的数据作为选项
  if (props.dict && dictData.value[props.dict]) {
    state.options = dictData.value[props.dict]
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
