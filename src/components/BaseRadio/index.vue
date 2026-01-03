<template>
  <a-radio-group
    v-if="state.options"
    v-model:value="state.value"
    button-style="solid"
    @change="state.handleChange"
  >
    <template v-if="isButton">
      <a-radio-button
        v-for="(item, i) in state.options"
        :key="i"
        :value="item[fieldNames.value]"
      >
        {{ item[fieldNames.label] }}
      </a-radio-button>
    </template>
    <template v-else>
      <a-radio
        v-for="(item, i) in state.options"
        :key="i"
        :value="item[fieldNames.value]"
      >
        {{ item[fieldNames.label] }}
      </a-radio>
    </template>
  </a-radio-group>
</template>

<script setup lang="ts" name="BaseRadio">
import { useBaseForm } from '@/hooks/useBaseForm'
type optionType = { [key: string]: any; label: string; value: string }
type ValueType = string | number | undefined

interface StateType {
  value: ValueType
  options: Array<optionType>
  handleChange: (_value: ValueType) => void
}

interface PropsType {
  value: ValueType
  isButton?: boolean
  fieldNames?: optionType
  options?: Array<optionType>
  dict?: string
  api?: string
  params?: Record<string, any>
}
const props = withDefaults(defineProps<PropsType>(), {
  value: () => '',
  isButton: () => false,
  fieldNames: () => {
    return { label: 'label', value: 'value' }
  },
  options: () => [],
  dict: () => '',
  api: () => '',
  params: () => ({})
})
const emit = defineEmits(['update:value'])
const { getDictData } = useBaseForm()

const state = reactive<StateType>({
  value: '1',
  options: [],
  handleChange() {
    emit('update:value', state.value)
  }
})

onMounted(async () => {
  getDictData(state, props.dict, props.api, props.params, props.options)
})
</script>
