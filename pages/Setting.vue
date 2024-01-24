<template>
  <div>
    <div class="setting-container">
      <h2>设置</h2>
      <a-divider></a-divider>
      <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false">
        <a-form-item ref="token" label="token" name="token">
          <a-input v-model:value="formState.token" style="width: 500px" />
          <a style="margin-left: 8px" target="_blank" href="https://alist.nn.ci/zh/guide/drivers/aliyundrive.html">token获取链接</a>
        </a-form-item>

        <a-form-item label="网盘搜索引擎" name="engine">
          <a-radio-group v-model:value="formState.engine">
            <a-radio value="pansearch">PanSearch</a-radio>
            <a-radio value="wogg">玩偶</a-radio>
            <a-radio value="dovx">七夜</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label=" ">
          <a-button type="primary" @click="onSubmit">保存</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, toRaw } from 'vue';
const formRef = ref();
const labelCol = {
  span: 5,
};
const wrapperCol = {
  span: 13,
};
const formState = reactive({
  token: '',
  engine: 'pansearch',
});
const rules = {
  token: [
    {
      required: true,
      message: '请输入token',
      trigger: 'change',
    },
  ],
  engine: [
    {
      required: true,
      trigger: 'change',
    },
  ],
};
const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      saveSetting(toRaw(formState));
    })
    .catch((error) => {
      console.log('error', error);
    });
};

const saveSetting = (value) => {
  setLocalStrorage('ali_token', value.token);
  setLocalStrorage('engine', value.engine);
  message.success('保存成功');
};

onMounted(() => {
  initToken();
});

const initToken = () => {
  const engine = getLocalstorage('engine');
  if (engine) {
    formState.engine = engine;
  }
  const ali_token = getLocalstorage('ali_token');
  if (ali_token) {
    formState.token = ali_token;
  }
};
</script>

<style lang="less" scoped>
.setting-container {
  width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  h2 {
    margin: 0;
  }
}
</style>
