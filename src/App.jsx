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
import { createContext, useEffect, useState } from "react";

import useAuth from "./Hooks/useAuth";

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const { handleVerifyToken } = useAuth();
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

  const publicRouter = createBrowserRouter(publicRoutes);
  const privateRouter = createBrowserRouter(privateRoutes);

  const [router, setRouter] = useState(publicRouter);

  useEffect(() => {
    handleVerifyToken(setUser);
  }, [user]);

  useEffect(() => {
    console.log(user);
    user ? setRouter(privateRouter) : setRouter(publicRouter);
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
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
    </UserContext.Provider>
  );
}

export default App;
