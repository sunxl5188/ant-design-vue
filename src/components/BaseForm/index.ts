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
  fieldNames?: { label: string; value: string } // 获取选项的接口返回字段映射
  mode?: boolean // 多选模式
  isButton?: boolean // 是否按钮样式(仅radio有效)
  slot?: string // 自定义插槽名称
}

export interface BaseFormProps {
  formRef: FormInstance | null
  formData: Record<string, any>
  handleSubmit: () => Promise<{ code: number; msg: string; data: any }>
  handleReset: () => void
  getBindInputValue: ComputedRef<(_item: FormItemType) => any>
  getBindTextareaValue: ComputedRef<(_item: FormItemType) => any>
  getBindInputNumberValue: ComputedRef<(_item: FormItemType) => any>
}
