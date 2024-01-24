<template>
  <div class="detail-container">
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
      <div class="search-content">
        <h1>资源列表</h1>
        <div class="movie-item-list">
          <a-card @click="handleNavToDetail(item)" class="movie-item" v-for="(item, i) of movieList" hoverable :key="item.vod_id">
            <template #cover>
              <img :alt="item.vod_name" :src="item.vod_pic" />
            </template>
            <a-card-meta :title="item.vod_name">
              <template #description>{{ item.vod_remarks }}</template>
            </a-card-meta>
          </a-card>
        </div>
      </div>
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
  const { data } = await useFetch('/api/search', { query: { keywords: query.value.title } });

  if (data.value && data.value.status === 'success') {
    movieList.value = data.value.data.list;
    console.log(movieList.value);
  }
};

const checkResource = async () => {};

const getPlayData = async () => {
  const id = route.query.id;
  const { data } = await useFetch('/api/detail', { query: { id: id } });
  const result = data.value.data.list[0];
  const flagListValue = result.vod_play_from.split('$$$');
  const allVideoListValue = {};

  const urlArray = result.vod_play_url.split('$$$');

  flagListValue.forEach((item, i) => {
    const urlStr = urlArray[i];
    const videoItemArr = urlStr.split('#').map((it) => {
      return {
        name: it.split('$')[0],
        url: it.split('$')[1],
      };
    });
    allVideoListValue[item] = videoItemArr;
  });

  allVideoList.value = allVideoListValue;
  flagList.value = flagListValue;
  currentFlag.value = flagListValue[0];
  videoList.value = allVideoList.value[currentFlag.value];
};

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
  margin-top: 20px;
  padding: 20px;
  background: #fff;
  .movie-item-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
}

.movie-item {
  width: 154px;
  padding: 12px;
  img {
    height: 140px;
  }
}

:deep(.ant-card-body) {
  padding: 0;
  margin-top: 20px;
}
</style>
