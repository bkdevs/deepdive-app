import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "store/auth_store";

export const RecognizedRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
