<template>
  <div>
    <div class="banner">
      <SearchComp v-model:value="keywords" @onSearch="onSearch" />
    </div>
    <div>
      <div class="filter-container">
        <div class="filter-items">
          <a-radio-group v-model:value="categoryValue" button-style="solid">
            <a-space wrap>
              <a-radio-button value="hot">热播</a-radio-button>
              <a-radio-button value="tag_movie">片库</a-radio-button>
              <a-radio-button value="top250">top250</a-radio-button>
            </a-space>
          </a-radio-group>
        </div>
        <div v-if="subCategoryVisible" class="filter-items">
          <a-radio-group v-model:value="subCategoryValue" button-style="solid">
            <a-space wrap>
              <a-radio-button v-for="(item, i) of subCategory" :value="item.key" :key="item.key">{{ item.name }}</a-radio-button>
            </a-space>
          </a-radio-group>
        </div>
        <div v-if="movieTagsVisible">
          <div v-for="(item, i) of movieTags" :key="item.style" class="filter-items">
            <a-radio-group v-model:value="movieTagValues[i]" button-style="solid">
              <a-space wrap>
                <a-radio-button v-for="it of item.data" :key="it" :value="it">{{ it }}</a-radio-button>
              </a-space>
            </a-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div class="list-content">
      <a-spin :spinning="loading">
        <div class="item-list">
          <a-badge-ribbon v-for="(item, i) of movieList" :text="item.rating.value" :key="item.id">
            <a-card class="movie-item" hoverable @click="handleClickCard(item)">
              <template #cover>
                <img class="movie-pic" :alt="item.title" :src="item.pic.normal" referrerpolicy="no-referrer" />
                <div class="tag-box">
                  <a-space wrap>
                    <a-tag class="movie-tag" v-for="(tag, iTag) of getSplitTags(item.card_subtitle)" color="orange" :key="tag">{{ tag }}</a-tag>
                  </a-space>
                </div>
              </template>
              <a-card-meta :title="item.title">
                <template #description>
                  <p class="movie-comment">
                    {{ item.comment }}
                  </p>
                </template>
              </a-card-meta>
            </a-card>
          </a-badge-ribbon>
        </div>
        <div class="pagination-container">
          <a-pagination v-model:current="currentPage" v-model:pageSize="pageSize" show-quick-jumper :total="total" @change="onPageChange" />
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

const keywords = ref('');
const movieList = ref([]);

const currentPage = ref(1);
const onPageChange = (page) => {
  currentPage.value = page;
};
const total = ref(0);
const pageSize = ref(20);

watch(currentPage, () => {
  fetchDataBySubCategory();
});

watch(pageSize, () => {
  currentPage.value = 1;
  fetchDataBySubCategory();
});

const categoryValue = ref('');
onMounted(() => {
  categoryValue.value = 'hot';
  if (!getLocalstorage('engine')) {
    setLocalStrorage('engine', 'pansearch');
  }
});
const movieTagValues = reactive(['全部形式', '全部地区', '全部类型', '全部年代']);
const subCategoryVisible = ref(true);
const movieTagsVisible = ref(false);
const subCategoryValue = ref('hot_gaia');

const hotCategory = [
  { name: '电影', key: 'hot_gaia' },
  { name: '电视剧', key: 'tv_hot' },
  { name: '国产剧', key: 'tv_domestic' },
  { name: '美剧', key: 'tv_american' },
  { name: '日剧', key: 'tv_japanese' },
  { name: '韩剧', key: 'tv_korean' },
  { name: '动漫', key: 'tv_animation' },
  { name: '综艺', key: 'show_hot' },
];

watch(categoryValue, async () => {
  if (categoryValue.value === 'hot') {
    subCategory.value = hotCategory;
    subCategoryVisible.value = true;
    movieTagsVisible.value = false;
    fetchDataBySubCategory();
  }
  if (categoryValue.value === 'tag_movie') {
    movieTagsVisible.value = true;
    subCategoryVisible.value = false;
    movieList.value = [];
    getTagMovie();
  }
  if (categoryValue.value === 'top250') {
    movieTagsVisible.value = false;
    subCategoryVisible.value = false;
    movieList.value = [];
    const res = await handleFetchData('movie_top250');
    movieList.value = res.subject_collection_items;
  }
});

const movieTags = ref([]);

const getTagMovie = async () => {
  const res = await handleFetchData('tag_movie', movieTagValues.join(','));
  if (movieTags.value.length === 0) {
    movieTags.value = res.tags;
  }
  movieList.value = res.data;
};

const subCategory = ref(hotCategory);

const fetchDataBySubCategory = async () => {
  movieList.value = [];
  const res = await handleFetchData(subCategoryValue.value);
  movieList.value = res.items || res.subject_collection_items;
};

watch(subCategoryValue, async () => {
  await fetchDataBySubCategory();
});

watch(movieTagValues, async () => {
  await getTagMovie();
});

const onSearch = async (val) => {
  router.push({ path: '/search', query: { keywords: keywords.value } });
};

const getSplitTags = (tagString) => {
  return tagString
    .split('/')
    .slice(0, 3)
    .map((item) => item.trim());
};

const loading = ref(false);

const handleFetchData = async (key, query) => {
  loading.value = true;
  const { data } = await useFetch('/api/movie_list', { query: { key, q: query, start: (currentPage.value - 1) * pageSize.value, count: pageSize.value } });
  loading.value = false;
  if (data.value && data.value.status === 'success') {
    total.value = data.value.data.total;
    return data.value.data;
  }
};

const handleClickCard = (item) => {
  router.push({ path: '/detail', query: { title: item.title, pic: item.pic.normal, card_subtitle: item.card_subtitle, comment: item.comment } });
};
</script>

<style lang="less" scoped>
.banner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
}

.list-content {
}

.item-list {
  min-height: calc(100vh - 408px);
  width: 1200px;
  margin: 12px auto;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.movie-item {
  width: 230px;
  padding: 12px;
}

.movie-comment {
  margin: 12px 0;
  white-space: pre-wrap;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-pic {
  height: 280px;
}

:deep(.ant-card-body) {
  padding: 0;
  margin-top: 20px;
}

:deep(.ant-card-cover) {
  position: relative;
}

.tag-box {
  position: absolute;
  left: 8px;
  bottom: 16px;
  // width: min-content;
}

.movie-tag {
  opacity: 0.8;
}

.filter-container {
  width: 1200px;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
}

.filter-items {
  padding: 12px;
}

.pagination-container {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: row-reverse;
}
</style>
