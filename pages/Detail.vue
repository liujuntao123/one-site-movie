<template>
  <div class="detail-container">
    <subtitle subtitle="影片详情"></subtitle>
    <div class="main-content">
      <div class="info-content">
        <div class="pic">
          <img :src="query.pic" />
        </div>
        <div class="info-list">
          <a-descriptions title="影视信息" :column="1">
            <a-descriptions-item label="片名">{{ query.title }}</a-descriptions-item>
            <a-descriptions-item label="信息">{{ query.card_subtitle }}</a-descriptions-item>
            <a-descriptions-item label="简介">{{ query.comment }}</a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
      <search-content :movieList="movieList"></search-content>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const query = ref(route.query);

const movieList = ref([]);

onMounted(async () => {
  handleFetchData();
});

const handleFetchData = async () => {
  const { data } = await useFetchWithEngine('/api/search', { query: { keywords: query.value.title } });
  if (data.value && data.value.status === 'success') {
    movieList.value = data.value.data.list;
  } else {
    message.error('获取数据失败');
  }
};
</script>

<style lang="less" scoped>
.main-content {
  width: 1200px;
  margin: 20px auto;
}
.info-content {
  display: flex;
  gap: 40px;
  padding: 20px;
  background: #fff;
  .pic {
    width: 200px;
    img {
      width: 100%;
    }
  }
  .info-list {
    flex: 1;
  }
}

.search-content {
  width: 1200px;
  margin: 0 auto;
  margin-top: 20px;
  // padding: 20px;
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
  width: 184px;
  padding: 12px;
  img {
    height: 200px;
  }
}

:deep(.ant-card-body) {
  padding: 0;
  margin-top: 20px;
}
</style>
