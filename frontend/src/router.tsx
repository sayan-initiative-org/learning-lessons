import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./routes/HomePage";
import { TutorialPage } from "./routes/TutorialPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "tutorials/:slug", element: <TutorialPage /> },
    ],
  },
]);
