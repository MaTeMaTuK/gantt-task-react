export const getLocalStorageItem = (key: string, defalut: any = ""): any => {
  try {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      return (item && JSON.parse(item)) || defalut;
    }
  } catch (e) {
    return localStorage.getItem(key) || defalut;
  }
};

export const setLocalStorageItem = (key: string, value: unknown): boolean => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export default {
  getLocalStorageItem,
  setLocalStorageItem,
};
