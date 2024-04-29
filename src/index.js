import { ConfigProvider, theme } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Activation from "routes/activation";
import AppLayout from "routes/app_layout";
import CreateSession from "routes/create_session";
import Error from "routes/error";
import Home from "routes/home";
import HomeLayout from "routes/home_layout";
import Login from "routes/login";
import NotFound from "routes/not_found";
import Profile from "routes/profile";
import { RecognizedRoute } from "routes/recognized";
import Session, {
  action as sessionAction,
  loader as sessionLoader,
} from "routes/session";
import ShareLayout from "routes/share_layout";
import SharedSession, {
  loader as sharedSessionLoader,
} from "routes/shared_session";
import Signup from "routes/signup";
import SocialAuth from "routes/social_auth";
import { UnrecognizedRoute } from "routes/unrecognized";
import reportWebVitals from "./reportWebVitals";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    element: <UnrecognizedRoute />,
    errorElement: <Error />,
    children: [
      {
        element: <HomeLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/:provider/callback",
        element: <SocialAuth />,
      },
    ],
  },
  {
    element: <RecognizedRoute />,
    errorElement: <Error />,
    children: [
      {
        path: "/app",
        element: <AppLayout />,
        children: [
          {
            element: <CreateSession />,
            index: true,
          },
          {
            path: "sessions/:sessionId",
            element: <Session />,
            loader: sessionLoader,
            action: sessionAction,
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
  {
    path: "/activate/:key",
    element: <Activation />,
    errorElement: <Error />,
  },
  {
    element: <ShareLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "share/:sessionId",
        element: <SharedSession />,
        loader: sharedSessionLoader,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.compactAlgorithm,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConfigProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
