import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { TutorialsPage } from "./routes/TutorialsPage";
import { TutorialPage } from "./routes/TutorialPage";
import { PrioritiesLedgerPage } from "./routes/PrioritiesLedgerPage";
import { ResearchTopicsPage } from "./routes/ResearchTopicsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/tutorials" replace /> },
      { path: "tutorials", element: <TutorialsPage /> },
      { path: "tutorials/:slug", element: <TutorialPage /> },
      { path: "priorities", element: <PrioritiesLedgerPage /> },
      { path: "research", element: <ResearchTopicsPage /> },
    ],
  },
]);
