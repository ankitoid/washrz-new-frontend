import axios from "../config.jsx";
import useAuth from "./useAuth.jsx";

function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/auth/refresh", {
      withCredentials: true,
    });

    setAuth((prev) => ({
      ...prev,
      accessToken: response.data.accessToken,
    }));

    return response.data;
  };

  return refresh;
}

export default useRefreshToken;
