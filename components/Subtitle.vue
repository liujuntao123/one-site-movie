<template>
  <div class="subtitle-container">
    <a-space>
      <a-button type="text" @click="$router.go(-1)">
        <ArrowLeftOutlined />
      </a-button>

      <div class="subtitle-text">{{ subtitle }}</div>
    </a-space>
  </div>
</template>

<script setup>
defineProps({
  subtitle: {
    type: String,
    required: true,
  },
});
</script>

<style lang="less" scoped>
.subtitle-container {
  display: flex;
  align-items: center;
  height: 40px;
  background: #fff;
  box-shadow: 0 1px 14px 0 rgba(102, 118, 153, 0.16);
  border-top: 1px solid #edf1f3;
}
</style>
