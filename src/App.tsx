import React from "react";
import "./App.css";
import "./styles/sb-admin-2.css";
import "./styles/sb-admin-2.min.css";
import { ToastContainer } from "react-toastify";
import { AppRoutes } from "./AppRoutes";

function App() {
  return (
    <div className="App" id="wrapper">
     <AppRoutes />
     <ToastContainer />
    </div>
  );
}

export default App;
