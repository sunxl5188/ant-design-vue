<template>
  <a-tooltip>
    <template #title v-if="!isOverflow">
      <slot name="title">{{ title }}</slot>
    </template>
    <template #title v-else-if="tooltipDisabled">
      <slot name="title">{{ title }}</slot>
    </template>
    <slot>
      <div class="flex">
        <div class="truncate flex-1 w-0" @mouseenter="isBeyond">
          {{ title || '--' }}
        </div>
      </div>
    </slot>
  </a-tooltip>
</template>

<script setup lang="ts" name="BaseTip">
defineProps({
  title: { type: String, default: '' },
  isOverflow: { type: Boolean, default: false }
})

//判断文本是否益出~文本必须是单行
const tooltipDisabled = ref(false)

const isBeyond = (e: any) => {
  const ev = window.event || e
  const textContent = ev.target
  const clientW = textContent.clientWidth
  const scrollW = textContent.scrollWidth
  tooltipDisabled.value = scrollW > clientW
}
</script>
