export const setLocalStrorage = (key, value) => {
  if (!process.client) return;
  if (key && value !== '') {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    window.localStorage.setItem(key, value);
    console.log(`${key} local storage 设置成功`);
  }
};

export const getLocalstorage = (key) => {
  if (!process.client) return;
  let value = window.localStorage.getItem(key);
  value = value === null ? '' : value;
  return value;
};

export const removeLocalstorage = (key) => {
  if (!process.client) return;
  if (this.getLocalstorage(key)) {
    window.localStorage.removeItem(key);
  }
};
