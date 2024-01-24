<template>
  <div>
    <div class="play-container">
      <div class="play-content">
        <div class="player-box">
          <div id="dplayer" referrerpolicy="no-referrer"></div>
          <a-alert style="margin-top: 12px" message="如果出现视频只有声音画面黑屏的情况，表示此浏览器不支持该视频编码,以下方法二选一：1.切换支持硬解码功能的浏览器，如chrome。2.切换除原画以外的清晰度。" type="warning" />
        </div>
      </div>
      <div class="select-list-content">
        <div class="video-select-list">
          <div class="flag-list">
            <a-radio-group v-model:value="currentFlag" button-style="solid">
              <a-radio-button v-for="(flag, i) of flagList" :key="flag" :value="flag">{{ flag }}</a-radio-button>
            </a-radio-group>
          </div>
          <a-divider></a-divider>
          <div class="video-list">
            <a-radio-group v-model:value="selectedItemUrl">
              <a-space wrap>
                <a-radio-button width="200px" @click="handlePlay(card.url)" v-for="(card, i) of videoList" :key="card.url" :value="card.url">
                  {{ card.name }}
                </a-radio-button>
              </a-space>
            </a-radio-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import DPlayer from 'dplayer';
import Hls from 'hls.js';

let dp = null;

const route = useRoute();

const allVideoList = ref({});
const selectedItemUrl = ref('');

const videoList = ref([]);
const currentFlag = ref('');
const flagList = ref([]);
const getPlayData = async () => {
  const id = route.query.id;
  const { data } = await useFetchWithToken('/api/detail', { query: { id: id } });
  if (data.value.status !== 'success') {
    message.error('获取视频资源信息失败，请选择别的资源');
    return;
  }
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
  // handlePlay(videoList.value[0].url)
};

watch(currentFlag, () => {
  videoList.value = allVideoList.value[currentFlag.value];
});
const initPlayer = (url) => {
  dp = new DPlayer({
    container: document.getElementById('dplayer'),
    autoplay: false,
    theme: '#FADFA3',
    loop: true,
    lang: 'zh-cn',
    screenshot: true,
    hotkey: true,
    preload: 'auto',
    logo: 'logo.png',
    volume: 0.7,
    mutex: true,
    video: {
      url: url,
      type: currentFlag.value === '原画' ? 'auto' : 'customHls',
      customType: {
        customHls: function (video, player) {
          const hls = new Hls();
          hls.loadSource(video.src);
          hls.attachMedia(video);
        },
      },
    },
  });
};

onMounted(() => {
  getPlayData();
  // initPlayer();
});

const handlePlay = async (url) => {
  const { data } = await useFetchWithToken('/api/play', {
    query: {
      flag: currentFlag.value,
      url: url,
      share_id: route.query.id,
    },
  });

  if (data.value.status !== 'success') {
    message.error('播放失败，请稍后再试');
    return;
  }

  const videoUrl = data.value.data.url;
  if (!dp) {
    initPlayer(videoUrl);
  } else {
    dp.switchVideo({
      url: videoUrl,
      type: currentFlag.value === '原画' ? 'auto' : 'customHls',
      customType: {
        customHls: function (video, player) {
          const hls = new Hls();
          hls.loadSource(video.src);
          hls.attachMedia(video);
        },
      },
    });
  }
};
</script>

<style lang="less" scoped>
.play-container {
  width: 1200px;
  margin: 20px auto;
}
.play-content {
  display: flex;
  padding: 20px;
  background: #fff;
  gap: 20px;
  .video-select-list {
    width: 300px;
    background: #fff;
  }
  .player-box {
    height: 720px;
    flex: 1;
    background: #fff;
  }
}
.video-list {
  height: 600px;
  overflow: auto;
}

.select-list-content {
  padding: 20px;
  margin-top: 20px;
  background: #fff;
}
</style>
