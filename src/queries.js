import { useQuery } from "react-query";
import { useMemo, useContext } from "react";
import { authAxios } from "http/axios";
import { SessionContext } from "routes/session";
import useAuthStore from "store/auth_store";

export const useAppQuery = ({ url, fetchInit = {}, reactQueryOptions }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const fetch = useMemo(() => {
    return async () => {
      const response = await authAxios.get(url, fetchInit);
      return response.data;
    };
  }, [url, fetchInit]);

  return useQuery([url, accessToken], fetch, {
    ...reactQueryOptions,
    refetchOnWindowFocus: false,
  });
};

export function useSessionsQuery() {
  return useAppQuery({
    url: `/sessions/`,
    reactQueryOptions: { staleTime: 60000 },
  });
}

export function getSessionsQuery() {
  const accessToken = useAuthStore.getState().accessToken;
  return {
    queryKey: [`/sessions/-${accessToken}`],
    queryFn: async () => await authAxios.get("/sessions/"),
    staleTime: 60000,
  };
}

export function useDatabasesQuery() {
  return useAppQuery({
    url: `/databases/`,
    reactQueryOptions: { staleTime: 60000 },
  });
}

export function useVisualizationsQuery() {
  const { session } = useContext(SessionContext);
  return useAppQuery({
    url: `/report/${session.id}`,
    reactQueryOptions: { staleTime: 60000 },
  });
}

export function useUserProfileQuery() {
  return useAppQuery({
    url: "/auth/user/",
    reactQueryOptions: { staleTime: "Infinity" },
  });
}
