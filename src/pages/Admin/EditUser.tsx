import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Select } from "antd";
import axios from "axios";
import { BASE_URL } from "../../axios/axios";
import { User } from "../../components/user.type";
import { EditOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { toastConfig } from "../../toast/toastConfig";

interface EditUserProps {
  userId: number;
  onEditUserSuccess: (updatedUser: User) => void;
}

const roleOptions = [
  { value: "1", label: "Admin" },
  { value: "2", label: "User" },
];

export const EditUser: React.FC<EditUserProps> = ({
  userId,
  onEditUserSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userId && open) {
      axios
        .get(`${BASE_URL}/user/show/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const user = res.data.user;
          form.setFieldsValue({
            ...user,
            role: user.role.toString(), // Ensure role value is a string
          });
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message ||
              "Failed to fetch user data. Please try again.",
            toastConfig
          );
        });
    }
  }, [userId, open, token, form]);

  const [loadingButton, setLoadingButton] = useState(false);

  const handleOk = () => {
    setLoadingButton(true);
    form
      .validateFields()
      .then((values) => {
        axios
          .put(`${BASE_URL}/user/edit/${userId}`, values, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setOpen(false);
            onEditUserSuccess(res.data.user);
            toast.success("User updated successfully", toastConfig);
          })
          .catch((error) => {
            toast.error(
              error.response?.data?.message ||
                "Failed to update user. Please try again.",
              toastConfig
            );
          })
          .finally(() => {
            setLoadingButton(false); // Reset loading state
          });
      })
      .catch((errorInfo) => {
        console.log("Validate Failed:", errorInfo);
        setLoadingButton(false); // Reset loading state if validation fails
      });
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        <EditOutlined />
      </Button>
      <Modal
        title="Edit User"
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okButtonProps={{ loading: loadingButton }} // Apply loading state to OK button
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Please input the username!" },
              { max: 20, message: "Username cannot be longer than 20 characters!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fullname"
            label="Full Name"
            rules={[
              { required: true, message: "Please input the full name!" },
              { max: 50, message: "Fullname cannot be longer than 50 characters!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "The input is not valid E-mail!" },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                message: "Email must be a valid Gmail address!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="number_phone"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input your phone number!" },
              { pattern: /^[0-9]{10}$/, message: "Phone number must be 10 digits!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select>
              {roleOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
