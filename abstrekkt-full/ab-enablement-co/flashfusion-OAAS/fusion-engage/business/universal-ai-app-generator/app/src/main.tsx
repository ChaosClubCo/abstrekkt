import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import UniversalAppGenerator from "./UniversalAppGenerator";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UniversalAppGenerator />
  </StrictMode>,
);
