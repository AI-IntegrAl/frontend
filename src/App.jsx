import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import LandingPage from "./Containers/LandingPage";
import Login from "./Containers/Login";
import ChatPage from "./Containers/Chat";
import { ToastContainer } from "react-toastify";

function App() {
  const router = createBrowserRouter([
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
      path: "/chat",
      element: <ChatPage />,
    },
    {
      path: "*",
      element: <h1>404 - Not Found</h1>,
    },
  ]);

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
