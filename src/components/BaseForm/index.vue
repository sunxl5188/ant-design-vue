<template>
  <a-form
    :ref="(el:any) => (form.formRef = el)"
    :model="formData"
    :rules="rules"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    autocomplete="off"
    scrollToFirstError
  >
    <a-form-item
      v-for="(item, i) in formItem"
      :key="i"
      :label="item.label"
      :name="item.prop"
    >
      <!-- slot插槽 -->
      <template v-if="item.slot">
        <slot :name="item.slot" :formData="formData" :prop="item.prop"></slot>
      </template>
      <a-input-number
        v-else-if="item.type === 'number'"
        v-model:value="formData[item.prop]"
        v-bind="form.getBindInputNumberValue(item)"
      />
      <!-- radio -->
      <base-radio
        v-else-if="item.type === 'radio'"
        v-model:value="formData[item.prop]"
        :isButton="item.isButton"
        :options="item.options"
        :dict="item.dict"
        :api="item.api"
        :params="item.params"
        :fieldNames="item.fieldNames"
      />
      <!-- select -->
      <base-select
        v-else-if="item.type === 'select'"
        v-model:value="formData[item.prop]"
        :placeholder="item.placeholder || `请选择${item.label}`"
        :options="item.options"
        :dict="item.dict"
        :api="item.api"
        :params="item.params"
        :fieldNames="item.fieldNames"
        :mode="item.mode"
      />
      <!-- 文本域 -->
      <a-textarea
        v-else-if="item.type === 'textarea'"
        v-model:value="formData[item.prop]"
        v-bind="form.getBindTextareaValue(item)"
      />
      <!-- 输入框 -->
      <a-input
        v-else-if="!item.type || item.type === 'input'"
        v-model:value="formData[item.prop]"
        v-bind="form.getBindInputValue(item)"
      />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts" name="BaseForm">
import type { FormItemType, BaseFormProps } from './index'
import { cloneDeep } from 'lodash-es'

interface PropsType {
  formItem: FormItemType[] // 表单项配置
  rules?: Record<string, any> // 表单校验规则
  record?: Record<string, any> // 编辑时传入的记录
}
const props = withDefaults(defineProps<PropsType>(), {
  formItem: () => [],
  rules: () => ({}),
  record: () => ({})
})

const defaultForm: Record<string, any> = {}
const form = reactive<BaseFormProps>({
  formRef: null,
  formData: {},
  //提交数据
  handleSubmit() {
    return new Promise(resolve => {
      form.formRef
        ?.validate()
        .then(() => {
          resolve({ code: 200, msg: '验证成功', data: form.formData })
        })
        .catch((err: any) => {
          console.log('🚀 ~ :', err)
          resolve({ code: 0, msg: '验证失败', data: null })
        })
    })
  },
  //重置表单
  handleReset(): void {
    form.formData = cloneDeep(defaultForm)
    form.formRef?.clearValidate()
  },
  // 获取输入框绑定属性
  getBindInputValue: computed(() => {
    return (item: FormItemType) => {
      return {
        placeholder: item.placeholder || `请输入${item.label}`,
        allowClear: true,
        maxlength: 50,
        ...item.attr
      }
    }
  }),
  // 获取文本域绑定属性
  getBindTextareaValue: computed(() => {
    return (item: FormItemType) => {
      return {
        placeholder: item.placeholder || `请输入${item.label}`,
        allowClear: true,
        maxlength: 500,
        showCount: true,
        autoSize: { minRows: 4, maxRows: 5 },
        ...item.attr
      }
    }
  }),
  // 获取数字输入框绑定属性
  getBindInputNumberValue: computed(() => {
    return (item: FormItemType) => {
      return {
        placeholder: item.placeholder || `请输入${item.label}`,
        ...item.attr
      }
    }
  })
})

onMounted(() => {
  props.formItem.forEach((item: any) => {
    defaultForm[item.prop] = props.record[item.prop] || item.value || undefined
  })

  form.formData = cloneDeep(defaultForm)
})

const { formData } = toRefs(form)

defineExpose({
  handleSubmit: form.handleSubmit,
  handleReset: form.handleReset
})
</script>
