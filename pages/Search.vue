<template>
  <div class="detail-container">
    <subtitle subtitle="影片搜索"></subtitle>
    <div class="main-content">
      <div class="banner">
        <SearchComp v-model:value="keywords" @onSearch="onSearch" />
      </div>
      <div>
        <a-spin :spinning="loading" style="min-height: 600px">
          <search-content :movieList="movieList"></search-content>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const query = ref(route.query);
const keywords = ref(query.value.keywords);

const movieList = ref([]);

onMounted(async () => {
  onSearch();
});

const onSearch = () => {
  if (keywords.value) {
    handleFetchData();
  }
};

const loading = ref(false);
const handleFetchData = async () => {
  loading.value = true;
  const { data } = await useFetchWithEngine('/api/search', { query: { keywords: query.value.keywords } });
  loading.value = false;

  if (data.value && data.value.status === 'success') {
    movieList.value = data.value.data.list.filter((item) => item.vod_id.includes('www.aliyundrive.com'));
  } else {
    message.error('搜索失败，请检查关键字是否正确');
  }
};
</script>

<style lang="less" scoped>
.main-content {
  width: 1200px;
  margin: 20px auto;
}
.banner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
}

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
