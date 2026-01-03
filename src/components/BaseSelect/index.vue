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
import { useBaseForm } from '@/hooks/useBaseForm'

interface StateType {
  value: string | number | Array<any> | undefined
  options: SelectProps['options']
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
    type: Array as () => SelectProps['options'],
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

const emit = defineEmits(['update:value', 'change'])
const { getDictData } = useBaseForm()

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
    emit('change', value, option)
  }
})

onMounted(async () => {
  getDictData(state, props.dict, props.api, props.params, props.options)
})

watch(
  () => props.value,
  newVal => {
    state.value = newVal || undefined
  },
  { immediate: true }
)
</script>
