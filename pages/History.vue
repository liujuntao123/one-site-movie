<template>
  <div class="history-container">
    <Subtitle subtitle="历史纪录"></Subtitle>

    <div class="history-content">
      <ItemList :movieList="movieList"></ItemList>
    </div>
  </div>
</template>

<script setup>
const historys = JSON.parse(getLocalstorage('history')) || [];
const movieList = ref(historys);
</script>
