import { DEEPDIVE_ACCESS_TOKEN, DEEPDIVE_REFRESH_TOKEN } from "constants";
import { unauthAxios } from "http/axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  accessToken: Cookies.get(DEEPDIVE_ACCESS_TOKEN),
  refreshToken: Cookies.get(DEEPDIVE_REFRESH_TOKEN),
  setAccessToken: (accessToken) => {
    Cookies.set(DEEPDIVE_ACCESS_TOKEN, accessToken, {
      expires: new Date(jwt_decode(accessToken).exp * 1000),
      secure: true,
    });
    set({ accessToken: accessToken });
  },
  setRefreshToken: (refreshToken) => {
    Cookies.set(DEEPDIVE_REFRESH_TOKEN, refreshToken, {
      expires: new Date(jwt_decode(refreshToken).exp * 1000),
      secure: true,
    });
    set({ refreshToken: refreshToken });
  },
  reset: () => {
    Cookies.remove(DEEPDIVE_ACCESS_TOKEN);
    Cookies.remove(DEEPDIVE_REFRESH_TOKEN);
    set({ accessToken: null, refreshToken: null });
  },
  login: async (values) => {
    const { data } = await unauthAxios.post("/auth/login/", values);
    get().setAccessToken(data.access);
    get().setRefreshToken(data.refresh);
  },
  logout: () => {
    unauthAxios.post("/auth/logout/", {
      access: get().accessToken,
      refresh: get().refreshToken,
    });
    get().reset();
  },
  refresh: async () => {
    const { data } = await unauthAxios.post("/auth/token/refresh/", {
      refresh: get().refreshToken,
    });
    get().setAccessToken(data.access);
    get().setRefreshToken(data.refresh);
  },
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useAuthStore);
}

export default useAuthStore;
