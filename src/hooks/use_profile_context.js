import { useContext } from "react";
import { ProfileContext } from "routes/profile";

const useProfileContext = () => {
  return useContext(ProfileContext);
};

export default useProfileContext;
