import { kv } from '@vercel/kv';

export const getLastPath = (url) => {
  const paths = url.split('/');
  return paths[paths.length - 1];
};

export const req = (...args) => {
  return (
    $fetch(...args)
      // .then((res) => {
      //   if (res.text) {
      //     return res.text();
      //   }
      // })
      .then((res) => {
        if (!res.content) {
          return { content: res };
        }
        return res;
      })
      .catch((error) => {
        return error;
      })
  );
};

export const jsonParse = (jsonString) => {
  if (!jsonString) return null;
  if (typeof jsonString === 'object') return jsonString;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
};

export const store = {
  set: async (path1, path2, val) => {
    const res = await kv.set(`${path1}/${path2}`, val);
    console.log('🚀 ~ set: ~ res:', '存储成功', res);
    return res;
  },
  get: async (path1, path2) => {
    const res = await kv.get(`${path1}/${path2}`);
    console.log('🚀 ~ get: ~ res:', '获取成功', res);
    return res;
  },
};
