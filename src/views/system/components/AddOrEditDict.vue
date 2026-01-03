<template>
  <a-button
    v-if="isEdit"
    type="link"
    size="small"
    @click="state.handleShowModal"
  >
    编辑
  </a-button>
  <a-button v-else type="primary" @click="state.handleShowModal">新增</a-button>
  <a-modal
    v-model:open="state.visible"
    :title="isEdit ? '编辑字典' : '新增字典'"
    width="700px"
    :confirmLoading="state.confirmLoading"
    @ok="state.handleConfirm"
    @cancel="state.handleCancel"
  >
    <base-form
      ref="formRef"
      :form-item="form.formItem"
      :rules="form.formRules"
      :record="record"
    >
      <template #colorPicker="{ formData, prop }">
        <div class="flex justify-start items-center flex-wrap">
          <div
            v-for="(item, i) in dictColors"
            :key="i"
            class="w-6 h-6 mr-1 mb-1 relative cursor-pointer"
            @click="formData[prop] = item[0]"
          >
            <div
              class="w-6 h-6 rounded-full absolute inset-0 border"
              :style="
                formData[prop] === item[0]
                  ? `border-color: ${item[0]}`
                  : 'border-color: #fff'
              "
            ></div>
            <div
              class="rounded-full w-4 h-4 absolute m-1 z-10"
              :style="`background-color: ${item[0]}`"
            ></div>
          </div>
        </div>
      </template>
    </base-form>
  </a-modal>
</template>

<script setup lang="ts" name="AddOrEditDict">
import BaseForm from '@/components/BaseForm'
import { dictColors } from '@/utils/dictColors'
import { addDictData, editDictData } from '@/api/systemDict'
import { useModal } from '@/utils/useModal'

const props = defineProps({
  isEdit: { type: Boolean, default: false },
  record: { type: Object, default: () => ({}) }
})

const { message } = useModal()
const state = reactive({
  visible: false,
  confirmLoading: false,
  handleShowModal() {
    state.visible = true
  },
  handleConfirm() {
    form.handleSubmit()
  },
  handleCancel() {
    state.visible = false
  }
})
const emit = defineEmits(['refresh'])
const defaultForm = {}
const formRef = ref<InstanceType<typeof BaseForm> | null>(null)
const form = reactive({
  formData: { ...defaultForm },
  formItem: [
    {
      label: '字典名称',
      prop: 'dictName',
      value: undefined,
      placeholder: '请输入字典名称'
    },
    {
      label: '字典数值',
      prop: 'dictValue',
      value: undefined,
      placeholder: '请输入字典数值'
    },
    {
      label: '颜色值',
      prop: 'dictColor',
      value: undefined,
      slot: 'colorPicker'
    },
    {
      label: '排序',
      prop: 'sort',
      value: 1,
      type: 'number',
      placeholder: '请输入排序'
    },
    {
      label: '描述',
      prop: 'remark',
      value: undefined,
      placeholder: '请输入描述'
    },
    {
      label: '状态',
      prop: 'status',
      value: '1',
      type: 'radio',
      isButton: true,
      dict: 'dict_item_status'
    }
  ],
  formRules: {
    dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
    dictValue: [{ required: true, message: '请输入字典数值', trigger: 'blur' }]
  },
  //提交数据
  async handleSubmit() {
    const res = await formRef.value?.handleSubmit()
    if (res?.code === 200) {
      let serviceApi = props.isEdit ? editDictData : addDictData
      let data = { ...res.data }
      if (props.isEdit) {
        data.id = props.record.id
      }
      data.dictCode = props.record.dictCode
      state.confirmLoading = true
      const { code, msg } = await serviceApi(data)
      if (code === 200) {
        message.success(msg)
        state.handleCancel()
        emit('refresh')
      } else message.error(msg)
      state.confirmLoading = false
    }
  }
})
</script>
