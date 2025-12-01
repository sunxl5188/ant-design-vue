<template>
  <div>222222222</div>
</template>

<script setup lang="ts" name="MonitorPage">
import { useRoute } from 'vue-router'
const route = useRoute()
onMounted(() => {
  console.log(route.name)
})
</script>
