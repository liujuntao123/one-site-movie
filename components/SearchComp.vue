<template>
  <a-input size="large" @press-enter="$emit('onSearch')" style="width: 800px; height: 52px" v-model:value="value" placeholder="输入影片名字">
    <template #suffix>
      <SearchOutlined @click="$emit('onSearch')" style="cursor: pointer; font-size: 24px" />
    </template>
  </a-input>
</template>

<script setup>
const value = defineModel('value');
</script>
