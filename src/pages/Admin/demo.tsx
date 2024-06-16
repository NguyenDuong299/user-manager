import React from "react";
import { Button } from "antd";
import {ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Demo = () => {
  const toastOptions:any = {
    position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
  }
  const handleToast = () => {
    toast.success('User deleted successfully!', toastOptions);
  };

  return (
    <div>
      <Button onClick={handleToast} type="primary">demo</Button>
    </div>
  );
};
