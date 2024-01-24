export const getLastPath = (url) => {
  const paths = url.split('/');
  return paths[paths.length - 1];
};

export const req = (...args) => {
  return $fetch(...args)
    .then((res) => {
      return { ...res, content: JSON.stringify(res) };
    })
    .catch((error) => {
      return error;
    });
};
