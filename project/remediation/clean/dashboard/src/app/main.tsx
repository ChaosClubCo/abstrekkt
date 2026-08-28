import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { SignIn } from "./components/SignIn";
import "../styles/flashfusion.css";
import "../styles/fonts.css";
import "./styles/app.css";

function AppRoot() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem("ff_auth"));
  if (!authed) {
    return <div className="app-scope"><SignIn onAuth={() => { try { localStorage.setItem("ff_auth", "1"); } catch {} setAuthed(true); }} /></div>;
  }
  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
);
