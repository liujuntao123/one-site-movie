export default defineNuxtRouteMiddleware((to, from) => {
  // console.log(to.path)
  if (process.server) return;
  // 检查是否是播放页面，如果是，则检查localstorage中是否有token，如果没有，则弹窗提示，并阻止跳转
  if (to.path === '/play') {
    const token = getLocalstorage('ali_token');

    if (!token) {
      Modal.info({
        title: '提示',
        content: '请先前往设置页面设置token，否则无法使用在线播放功能',
        onOk() {},
      });
      return abortNavigation();
    }
  }
});
