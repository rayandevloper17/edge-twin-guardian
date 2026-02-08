import { createRoot } from "react-dom/client";
import { DashboardProvider } from "./context/DashboardContext";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <DashboardProvider>
    <App />
  </DashboardProvider>
);
