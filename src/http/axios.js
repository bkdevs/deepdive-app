import axios from "axios";
import {
  DEEPDIVE_ACCESS_TOKEN,
  DEEPDIVE_REFRESH_TOKEN,
  DEEPDIVE_SERVER_HTTP,
} from "constants";
import Cookies from "js-cookie";
import useAuthStore from "store/auth_store";

export const unauthAxios = axios.create({
  // withCredentials: true,
  baseURL: `${DEEPDIVE_SERVER_HTTP}`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authAxios = axios.create({
  // withCredentials: true,
  baseURL: `${DEEPDIVE_SERVER_HTTP}`,
});

unauthAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Django simple JWT throws 401 for unauthorized requests
    console.log(error);
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

authAxios.interceptors.request.use(async (config) => {
  const accessToken = Cookies.get(DEEPDIVE_ACCESS_TOKEN);
  if (accessToken === undefined) {
    const refreshToken = Cookies.get(DEEPDIVE_REFRESH_TOKEN);
    if (refreshToken === undefined) {
      useAuthStore.getState().reset();
      // cancel this request
      return {
        ...config,
        signal: AbortSignal.abort(),
      };
    }
    await useAuthStore.getState().refresh();
  }
  config.headers.Authorization = `JWT ${Cookies.get(DEEPDIVE_ACCESS_TOKEN)}`;
  return config;
});
