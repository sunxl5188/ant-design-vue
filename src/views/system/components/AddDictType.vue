<template>
  <a-button v-if="isEdit" type="link">编辑</a-button>
  <a-button v-else type="primary" @click="modal.handleShowModal">
    新增字典
  </a-button>
  <a-modal
    v-if="modal.visible"
    :title="isEdit ? '编辑字典类型' : '新增字典类型'"
    :open="modal.visible"
    :confirmLoading="modal.confirmLoading"
    width="500px"
    centered
    destroyOnClose
    @ok="form.handleSubmit"
    @cancel="modal.handleCancel"
  >
    <BaseForm
      ref="formRef"
      :formItem="form.formItem"
      :rules="form.formRules"
      :record="form.record"
    />
  </a-modal>
</template>

<script setup lang="ts" name="AddDictType">
import BaseForm from '@/components/BaseForm'
import { addOrDictType } from '@/api/systemDict'
import { useModal } from '@/utils/useModal'

defineProps({
  isEdit: { type: Boolean, default: false },
  record: { type: Object, default: () => ({}) }
})

const { message } = useModal()
// 事件
const emit = defineEmits(['refresh'])

// 弹框操作
const modal = reactive({
  visible: false,
  confirmLoading: false,
  formData: {},
  // 弹框显示
  handleShowModal() {
    modal.visible = true
  },
  //关闭弹窗
  handleCancel: () => {
    modal.visible = false
  }
})
// 表单
const formRef = ref<InstanceType<typeof BaseForm> | null>(null)
const form = reactive({
  record: {},
  formItem: [
    {
      label: '字典名称',
      prop: 'dictName',
      value: undefined,
      attr: {
        placeholder: '请输入字典名称'
      }
    },
    {
      label: '字典编码',
      prop: 'dictCode',
      value: undefined,
      attr: {
        placeholder: '请输入字典编码'
      }
    },
    {
      label: '描述',
      prop: 'description',
      value: undefined,
      type: 'textarea',
      attr: {
        placeholder: '请输入描述'
      }
    }
  ],
  formRules: {
    dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
    dictCode: [{ required: true, message: '请输入字典编码', trigger: 'blur' }]
  },
  //提交数据
  async handleSubmit() {
    modal.confirmLoading = true
    const formData = await formRef.value?.handleSubmit().catch(() => {
      modal.confirmLoading = false
    })
    try {
      const { code, msg } = await addOrDictType(formData)
      if (code === 200) {
        message.success(msg)
        modal.handleCancel()
        emit('refresh')
      } else message.error(msg)
      modal.confirmLoading = false
    } catch (err: any) {
      message.error(err?.message || '请求失败')
    } finally {
      modal.confirmLoading = false
    }
  }
})
</script>
