const getAliToken = () => getLocalstorage('ali_token');
const getEngine = () => getLocalstorage('engine');

export const useFetchWithToken = (...args) => {
  return useFetch(args[0], { ...args[1], headers: { 'Ali-Token': getAliToken() } });
};

export const useFetchWithEngine = (...args) => {
  return useFetch(args[0], { ...args[1], headers: { 'Search-Engine': getEngine() } });
};
