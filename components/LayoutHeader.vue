<template>
  <div class="header-container">
    <div class="left">
      <div class="logo">
        <router-link to="/">
          <img style="height: 52px" src="../assets/logo.png" />
        </router-link>
      </div>
    </div>
    <div class="right">
      <a-button type="text">
        <a href="https://github.com/liujuntao123/one-site-movie">
          <GithubOutlined />
          github
        </a>
      </a-button>
      <a-button type="text" @click="$router.push('/history')">观看历史</a-button>
      <a-button type="text" @click="handleGoSetting">设置</a-button>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const handleGoSetting = () => {
  router.push('/setting');
};
</script>

<style lang="less" scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  width: 100%;
  z-index: 1000;
}
.logo {
  font-size: 24px;
  font-weight: 600;
}
</style>
