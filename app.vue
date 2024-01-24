<template>
  <a-layout>
    <layout-header class="layout-header"></layout-header>
    <a-layout-content class="layout-content">
      <NuxtPage />
    </a-layout-content>
    <layout-footer class="layout-footer"></layout-footer>
  </a-layout>
</template>

<script setup>
useHead({
  title: '一站影视',
});
</script>

<style lang="less" scoped>
@import url('./assets/styles/var.less');

body {
  margin: 0;
  padding: 0;
}

.layout-header {
  height: @layout-header-height;
  background-color: #fff;
}
.layout-footer {
  height: @layout-footer-height;
}
.layout-content {
  margin-top: @layout-header-height;
  min-height: calc(100vh - @layout-header-height - @layout-footer-height);
}
</style>

<style lang="less">
body {
  margin: 0;
  padding: 0;
}

p {
  margin: 0;
}
</style>
