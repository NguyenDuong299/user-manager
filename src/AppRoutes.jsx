import React from "react";
import { BrowserRouter as Router, useRoutes, Navigate } from "react-router-dom";
import { Login } from "./pages/Account/Login";
import { Admin } from "./pages/Admin/Admin";
import { AddUser } from "./pages/Admin/AddUser";
import { EditUser } from "./pages/Admin/EditUser";
import { Demo } from "./pages/Admin/demo";
const ProtectedRoute = ({ element, isAuthenticated, redirectPath }) => {
  return isAuthenticated ? (
    element
  ) : (
    <Navigate to={redirectPath} replace={true} />
  );
};

export const AppRoutes = () => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const routes = useRoutes([
    {
      path: "/",
      element: isAuthenticated ? <Admin /> : <Navigate to="/login" replace={true} />,
    },
    {
      path: "/login",
      element: isAuthenticated ? <Navigate to="/" replace={true} /> : <Login />,
    },
    {
      path: "/add_user",
      element: isAuthenticated ? <AddUser /> : <Navigate to="/login" replace={true} />,
    },
    {
      path: "/edit-user/:id",
      element: <ProtectedRoute element={<EditUser />} isAuthenticated={isAuthenticated} redirectPath="/login" />
    },
    {
      path: `/demo`,
      element: isAuthenticated ? <Demo /> : <Navigate to="/login" replace={true} />,
    },
  ]);

  return routes;
};
