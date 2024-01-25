<template>
  <div class="search-content">
    <div class="search-content-header">
      <h1>资源列表</h1>
    </div>
    <div class="movie-item-list">
      <a-card @click="handleNavToDetail(item)" class="movie-item" v-for="(item, i) of movieList" :key="item.vod_id" hoverable>
        <template #cover>
          <img :alt="item.vod_name" :src="item.vod_pic" />
        </template>
        <a-card-meta :title="item.vod_name">
          <template #description>{{ item.vod_remarks }}</template>
        </a-card-meta>
      </a-card>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
defineProps({
  movieList: Array,
});

const handleNavToDetail = async (val) => {
  router.push({
    path: '/play',
    query: {
      id: val.vod_id,
    },
  });
};
</script>

<style lang="less" scoped>
.search-content {
  width: 1200px;
  margin: 0 auto;
  margin-top: 20px;
  padding: 20px;
  h1 {
    margin-top: 0;
  }
  .movie-item-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
}

.movie-item {
  width: 180px;
  padding: 12px;
  img {
    height: 200px;
  }
}

.search-content-header {
  display: flex;
  justify-content: space-between;
}

:deep(.ant-card-body) {
  padding: 0;
  margin-top: 20px;
}
</style>
