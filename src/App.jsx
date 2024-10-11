import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import LandingPage from "./Containers/LandingPage";
import Login from "./Containers/Login";
import ChatPage from "./Containers/Chat";
import { ToastContainer } from "react-toastify";
import { GoogleAuthProvider } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./Utils/firebase";

function App() {
  const provider = new GoogleAuthProvider();
  const publicRoutes = [
    {
      path: "/",
      element: <LandingPage provider={provider} />,
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
      element: <h1>404 - Not Found</h1>,
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
    auth.onAuthStateChanged((user) => {
      setRouter(user ? privateRouter : publicRouter);
    });
    return () => {
      localStorage.removeItem("userLoggedIn");
    };
  }, [auth]);

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
