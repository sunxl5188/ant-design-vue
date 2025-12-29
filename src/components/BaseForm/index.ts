import type { FormInstance } from 'ant-design-vue'

export { default } from './index.vue'

export interface FormItemType {
  label: string
  prop: string
  type?: string
  placeholder?: string
  options?: Array<{ label: string; value: any }> // 下拉,单选,多选,选项
  attr?: Record<string, any> // 表单项属性
  dict?: string // 字典类型
  api?: string // 获取选项的接口
  params?: Record<string, any> // 获取选项的接口参数
}

export interface BaseFormProps {
  formRef: FormInstance | null
  formData: Record<string, any>
  handleSubmit: () => Promise<Record<string, any>>
  handleReset: () => void
  getBindInputValue: ComputedRef<(_item: FormItemType) => any>
  getBindTextareaValue: ComputedRef<(_item: FormItemType) => any>
}
