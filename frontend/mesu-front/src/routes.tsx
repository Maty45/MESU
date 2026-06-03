import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Landing },
    ],
  },
]);
