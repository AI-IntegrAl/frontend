import { useDispatch, useSelector } from "react-redux";
import useAxiosInstance from "./useAxiosInstance";
import { logout, refreshAccessToken, setUser } from "../Redux/userSlice";
import { useNavigate } from "react-router-dom";
import { notify } from "../Utils/notify";

function useAuth() {
  const { axiosInstance } = useAxiosInstance();
  const dispatch = useDispatch();
  const access_token = useSelector((state) => state.user.access_token);
  const handleVerifyToken = async () => {
    try {
      const response = await axiosInstance.post("/verify-token");
      if (response) {
        dispatch(setUser(response.data.user));
      }
    } catch (error) {
      console.error("Error verifying token:", error);
    }
  };

  const handleRefreshToken = async () => {
    if (access_token) return;
    try {
      const response = await axiosInstance.post("/refresh-token");
      if (response) {
        dispatch(
          refreshAccessToken({ access_token: response.data.access_token })
        );

        return response.data.access_token;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  const handleLogoutUser = async (navigate) => {
    try {
      await axiosInstance.post("/logout-user");
      // Remove cookie from the window location
      document.cookie =
        "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      dispatch(logout());
      notify("Logged out successfully", "success");
      navigate("/");
    } catch (error) {
      console.error("Error logging out user:", error);
    }
  };

  return { handleVerifyToken, handleRefreshToken, handleLogoutUser };
}

export default useAuth;
