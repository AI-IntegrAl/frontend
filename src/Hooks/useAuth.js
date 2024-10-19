import useAxiosInstance from "./useAxiosInstance";

function useAuth() {
  const { axiosInstance, handleSetAccessToken } = useAxiosInstance();
  const handleVerifyToken = async (setUser) => {
    try {
      const response = await axiosInstance.post("/verify-token");
      if (response) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error verifying token:", error);
    }
  };

  const handleRefreshToken = async (setAccessToken) => {
    try {
      const response = await axiosInstance.post("/refresh-token");
      if (response) {
        handleSetAccessToken(response.data.access_token);
        setAccessToken(response.data.access_token);
        console.log("Token refreshed:", response.data.access_token);
        return response.data.access_token;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  return { handleVerifyToken, handleRefreshToken };
}

export default useAuth;
