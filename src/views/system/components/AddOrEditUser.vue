<template>
  <a-button v-if="mode === 'add'" type="primary">新增用户</a-button>
  <a-button v-if="mode === 'edit'" type="link" size="small">编辑</a-button>
</template>

<script setup lang="ts" name="AddOrEditUser">
defineProps({
  mode: { type: String, default: 'add' }
})
</script>

<style scoped lang="less"></style>
