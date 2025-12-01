<template>
  <div class="notfound-container">
    <h1>404</h1>
    <p>Page Not Found</p>
    <router-link to="/">Back Home</router-link>
  </div>
</template>

<script setup lang="ts" name="ErrorPage404"></script>

<style scoped>
.notfound-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: #888;
}
h1 {
  font-size: 5rem;
  margin-bottom: 0.5rem;
}
p {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>
