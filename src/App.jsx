import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import LandingPage from "./Containers/LandingPage";
import Login from "./Containers/Login";
import ChatPage from "./Containers/Chat";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

import useAuth from "./Hooks/useAuth";
import { useSelector } from "react-redux";

function App() {
  const { handleVerifyToken, handleRefreshToken } = useAuth();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const access_token = useSelector((state) => state.user.access_token);

  const publicRoutes = [
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/signup",
      element: <Login signInText={"Sign Up"} />,
    },
    {
      path: "/login",
      element: <Login signInText={"Login"} />,
    },
    {
      path: "*",
      element: (
        <>
          <h1>404 - Not Found</h1>
        </>
      ),
    },
  ];
  const privateRoutes = [
    {
      path: "/chat",
      element: <ChatPage />,
    },
    ...publicRoutes,
  ];

  // const publicRouter = createBrowserRouter(publicRoutes);
  const privateRouter = createBrowserRouter(privateRoutes);

  const [router, setRouter] = useState(privateRouter);

  useEffect(() => {
    if (access_token) handleVerifyToken();
  }, [access_token]);

  useEffect(() => {
    if (!isAuthenticated || !access_token) {
      handleRefreshToken();
    }
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
