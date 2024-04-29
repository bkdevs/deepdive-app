import { useContext } from "react";
import { SessionContext } from "routes/session";

const useSessionContext = () => {
  return useContext(SessionContext);
};

export default useSessionContext;
