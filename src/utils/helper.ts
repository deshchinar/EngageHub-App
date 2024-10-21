import AsyncStorage from '@react-native-async-storage/async-storage';

// export const getUserAuthToken = async () => {
//   try {
//     const authStr = await AsyncStorage.getItem(USER_LOGIN_DATA);
//     if (authStr) {
//       const authJSON = JSON.parse(authStr);
//       return authJSON.data.Token;
//     }
//   } catch (error) {
//     console.log('Error retrieving user auth token', error);
//   }
//   return null;
// };

export const setLocalStorageItem = async (key: any, data: any) => {
  try {
    if (data) {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.log('Error setting local storage item', error);
  }
};

export const getLocalStorageItem = async (key: any) => {
  try {
    const item = await AsyncStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.log('Error getting local storage item', error);
  }
  return null;
};

export const removeLocalStorageItem = async (key: any) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('Error removing local storage item', error);
  }
};

export const clearLocalStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log('Error clearing local storage', error);
  }
};
