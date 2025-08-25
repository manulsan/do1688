import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

//const api = axios.create({ baseURL: 'https://api.example.com' });
let baseURL;
if (import.meta.env.DEV) baseURL = '/api/naver';
//else if (import.meta.env.PROD) baseURL = 'https://openapi.naver.com/v1';
else if (import.meta.env.PROD) {
  //do1688.vercel.app/api/naver-search?query=TV&Client_Id=q_4av_CgXqetHsoPVQq8&Client_Secret=8IpmpZvDPN
  baseURL = 'https://do1688.vercel.app/api';
}

console.log('baseURL', baseURL);

const apiNaver = axios.create({
  baseURL: baseURL as string,
  headers: {
    'Content-Type': 'application/json', // 'X-Naver-Client-Id': 'q_4av_CgXqetHsoPVQq8',    // 'X-Naver-Client-Secret': '8IpmpZvDPN',
  },
});
export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  //app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});
export { apiNaver };
//export { api, apiNaver };
