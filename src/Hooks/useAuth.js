import axiosInstance from "../Utils/axiosInstance";

function useAuth() {
  const handleVerifyToken = async (setUser) => {
    try {
      const response = await axiosInstance.get("/verify-token");
      if (response) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error verifying token:", error);
    }
  };

  return { handleVerifyToken };
}

export default useAuth;
