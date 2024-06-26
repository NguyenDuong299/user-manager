import React, { useState } from "react";
import { Button, Modal, Form, Input, Select } from "antd";
import axios from "axios";
import { BASE_URL } from "../../axios/axios";
import { User } from "../../components/user.type";
import { toastConfig } from "../../toast/toastConfig";
import { toast } from "react-toastify";
interface AddUserProps {
  onAddUserSuccess: (data: User) => void; // Hoặc () => void nếu bạn chọn cách 2
}
const roleOptions = [
  { value: "1", label: "Admin" },
  { value: "2", label: "User" },
];
export const AddUser: React.FC<AddUserProps> = ({ onAddUserSuccess }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form] = Form.useForm();
  const showAddUser = () => {
    setIsAddOpen(true);
  };
  const handleCancelAdd = () => {
    setIsAddOpen(false);
    form.resetFields(); // Reset form fields when modal is closed
  };
  const token = localStorage.getItem("token");
  const [loadingButton, setLoadingButton] = useState(false);
  
  const onFinish = async (values: any) => {
    setLoadingButton(true)
    try {
      const response = await axios.post(`${BASE_URL}/user/create`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("User added successfully!", toastConfig);
      // callback event from child -> parent
      setIsAddOpen(false);
      form.resetFields(); // Reset form fields after successful submission
      onAddUserSuccess(response.data.user);
    } catch (error) {
      console.error("Failed:", error);
      toast.error("Form submission failed!", toastConfig);
    }
    finally{
      setLoadingButton(false)
    }
  };

  return (
    <>
      <Button type="primary" onClick={showAddUser}>
        Add
      </Button>
      <Modal
        title="Add User"
        open={isAddOpen}
        footer={null}
        onCancel={handleCancelAdd} // Close modal when clicking outside or pressing Esc
      >
        <Form form={form} layout="vertical" name="userForm" onFinish={onFinish}>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
              {
                max: 20,
                message: "Username cannot be longer than 20 characters!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fullname"
            label="Fullname"
            rules={[
              {
                required: true,
                message: "Please input your fullname!",
              },
              {
                max: 50,
                message: "Fullname cannot be longer than 50 characters!",
              },
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
            rules={[
              {
                required: false,
                message: "Please input your address!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="number_phone"
            label="Number Phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Phone number must be 10 digits!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            name="avatar"
            label="Avatar"
            rules={[
              {
                required: false,
                message: "Please input your avatar!",
              },
            ]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item
            name="password"
            label="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[
              {
                required: true,
                message: "Please input your role!",
              },
            ]}
          >
            <Select>
              {roleOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loadingButton}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
