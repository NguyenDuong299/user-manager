import React, { Fragment, useState, useEffect, useMemo } from "react";
import {
  Button,
  Popover,
  Avatar,
  Empty,
  Popconfirm,
  Spin,
  Pagination,
  Select,
  Space,
  Input,
  Form,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";
import { User } from "../../components/user.type";
import { BASE_URL } from "../../axios/axios";
import { toast } from "react-toastify";
import { toastConfig } from "../../toast/toastConfig";
import 'react-toastify/dist/ReactToastify.css';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { AddUser } from "./AddUser";
import { EditUser } from "./EditUser";
import debounce from "lodash/debounce";
export const Admin: React.FC = () => {
  const [form] = Form.useForm();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [fullName, setfullName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const location = useLocation();
  const [paramsFilter, setParamsFilter] = useState({
    username: "",
    role: 0,
    limit: 10,
    page: 1,
  });
  const [paramsInitialized, setParamsInitialized] = useState(false);

  useEffect(() => {
    const fetchFullname = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/ShowUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setfullName(response.data.user.fullname);
      } catch (error) {
        console.error("Failed to fetch fullname:", error);
      }
    };
    fetchFullname();
  }, [token]);

  const fetchUsers = (isLoading = true) => {
    if (isLoading) {
      setLoading(true);
      setUsers([]);
      setTotalUsers(0);
    }
    axios
      .get(`${BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: paramsFilter,
      })
      .then((res) => {
        setLoading(false);
        setUsers(res.data.user.data);
        setTotalUsers(res.data.user.total);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response?.data?.message || "Something went wrong");
      });
  };
  useEffect(() => {
    if (paramsInitialized) {
      fetchUsers();
    }
  }, [paramsFilter, paramsInitialized]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.size > 0) {
      const searchTerm = searchParams.get("searchTerm") || "";
      setParamsFilter({
        role: Number(searchParams.get("role") || "0"),
        username: searchTerm,
        page: Number(searchParams.get("page") || "1"),
        limit: 10,
      });
      form.setFieldValue('searchTerm', searchTerm)
    }
    setParamsInitialized(true);
  }, []);

  const handleRole = (role: number) => {
    setParamsFilter((prevParams) => ({
      ...prevParams,
      role,
      page: 1,
    }));
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("role", role.toString());
    searchParams.set("page", "1");
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const handlePagination = (page: number) => {
    setParamsFilter((prevParams) => ({
      ...prevParams,
      page: page,
    }));
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", page.toString());
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setParamsFilter((prevParams) => ({
          ...prevParams,
          username: value,
          page: 1,
        }));
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("searchTerm", value);
        searchParams.set("page", "1");
        navigate(`${location.pathname}?${searchParams.toString()}`);
      }, 500),
    [location, navigate]
  );

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const handleSuccess = () => {
    fetchUsers(false);
  };

  const handleDeleteUser = (id: number) => {
    axios
      .delete(`${BASE_URL}/user/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        toast.success("User deleted successfully!", toastConfig);
      })
      .catch(() => {
        toast.error("Error!", toastConfig);
      });
  };

  const confirm = (id: number) => {
    handleDeleteUser(id);
  };

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (error) {
    return <div>{error}</div>;
  }
  const content = (
    <div>
      <a className="dropdown-item" href="#">
        <UserOutlined className="mr-2 text-gray-400" />
        Profile
      </a>
      <a className="dropdown-item" href="#">
        <SettingOutlined className="mr-2 text-gray-400" />
        Settings
      </a>
      <div className="dropdown-divider" style={{ margin: "8px 0" }} />
      <a
        className="dropdown-item"
        href="#"
        data-toggle="modal"
        data-target="#logoutModal"
        onClick={handleLogout}
      >
        <LogoutOutlined className="mr-2 text-gray-400" />
        Logout
      </a>
    </div>
  );

  return (
    <Fragment>
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        <a
          className="sidebar-brand d-flex align-items-center justify-content-center"
          href="/"
        >
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink" />
          </div>
          <div className="sidebar-brand-text mx-3">
            SB Admin <sup>2</sup>
          </div>
        </a>
        {/* Divider */}
        <hr className="sidebar-divider my-0" />
        {/* Nav Item - Dashboard */}
        <li className="nav-item active">
          <a className="nav-link" href="/">
            <i className="fas fa-fw fa-tachometer-alt" />
            <span>Dashboard</span>
          </a>
        </li>
        {/* Divider */}
        <hr className="sidebar-divider" />
        {/* Heading */}
        <div className="sidebar-heading">Interface</div>
        {/* Nav Item - Pages Collapse Menu */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseTwo"
            aria-expanded="true"
            aria-controls="collapseTwo"
          >
            <i className="fas fa-fw fa-cog" />
            <span>Components</span>
          </a>
          <div
            id="collapseTwo"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Custom Components:</h6>
              <a className="collapse-item" href="buttons.html">
                Buttons
              </a>
              <a className="collapse-item" href="cards.html">
                Cards
              </a>
            </div>
          </div>
        </li>
        {/* Nav Item - Utilities Collapse Menu */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseUtilities"
            aria-expanded="true"
            aria-controls="collapseUtilities"
          >
            <i className="fas fa-fw fa-wrench" />
            <span>Utilities</span>
          </a>
          <div
            id="collapseUtilities"
            className="collapse"
            aria-labelledby="headingUtilities"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Custom Utilities:</h6>
              <a className="collapse-item" href="utilities-color.html">
                Colors
              </a>
              <a className="collapse-item" href="utilities-border.html">
                Borders
              </a>
              <a className="collapse-item" href="utilities-animation.html">
                Animations
              </a>
              <a className="collapse-item" href="utilities-other.html">
                Other
              </a>
            </div>
          </div>
        </li>
        {/* Divider */}
        <hr className="sidebar-divider" />
        {/* Heading */}
        <div className="sidebar-heading">Addons</div>
        {/* Nav Item - Pages Collapse Menu */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapsePages"
            aria-expanded="true"
            aria-controls="collapsePages"
          >
            <i className="fas fa-fw fa-folder" />
            <span>Pages</span>
          </a>
          <div
            id="collapsePages"
            className="collapse"
            aria-labelledby="headingPages"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Login Screens:</h6>
              <a className="collapse-item" href="login.html">
                Login
              </a>
              <a className="collapse-item" href="register.html">
                Register
              </a>
              <a className="collapse-item" href="forgot-password.html">
                Forgot Password
              </a>
              <div className="collapse-divider" />
              <h6 className="collapse-header">Other Pages:</h6>
              <a className="collapse-item" href="404.html">
                404 Page
              </a>
              <a className="collapse-item" href="blank.html">
                Blank Page
              </a>
            </div>
          </div>
        </li>
        {/* Nav Item - Charts */}
        <li className="nav-item">
          <a className="nav-link" href="charts.html">
            <i className="fas fa-fw fa-chart-area" />
            <span>Charts</span>
          </a>
        </li>
        {/* Nav Item - Tables */}
        <li className="nav-item">
          <a className="nav-link" href="tables.html">
            <i className="fas fa-fw fa-table" />
            <span>Tables</span>
          </a>
        </li>
        {/* Divider */}
        <hr className="sidebar-divider d-none d-md-block" />
        {/* Sidebar Toggler (Sidebar) */}
        <div className="text-center d-none d-md-inline">
          <button className="rounded-circle border-0" id="sidebarToggle" />
        </div>
      </ul>
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <ul className="navbar-nav ml-auto">
              <div className="topbar-divider d-none d-sm-block" />
              <li className="nav-item dropdown no-arrow">
                <Popover
                  content={content}
                  trigger="click"
                  placement="bottomRight"
                >
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                  >
                    <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                      {fullName}
                    </span>
                    <Avatar
                      size="large"
                      icon={
                        <img
                          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                          alt="profile"
                        />
                      }
                      className="img-profile rounded-circle"
                    />
                  </a>
                </Popover>
              </li>
            </ul>
          </nav>

          <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800 text-left">Users</h1>
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex justify-content-between">
                <Form form={form}>
                  <div className="d-flex">
                    <div className="input-group">
                      <Form.Item name="searchTerm">
                        <Input.Search
                          placeholder="Search..."
                          enterButton="Search"
                          onSearch={handleSearch}
                          onChange={(e) => debouncedSearch(e.target.value)}
                          style={{ width: 300, marginBottom: 10 }}
                        />
                      </Form.Item>
                    </div>
                    <Select
                      style={{
                        width: 220,
                        borderRadius: "7px",
                        border: "1px solid #4E73DF",
                        color: "#000",
                        margin: "0 0 0 -30px",
                      }}
                      placeholder="All"
                      value={paramsFilter.role}
                      onChange={(value) => handleRole(value as number)}
                    >
                      <Select.Option value={0}>All</Select.Option>
                      <Select.Option value={1}>Admin</Select.Option>
                      <Select.Option value={2}>User</Select.Option>
                    </Select>
                  </div>
                </Form>
                <AddUser onAddUserSuccess={handleSuccess} />
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table
                    className="table table-bordered"
                    id="dataTable"
                    width="100%"
                    cellSpacing={0}
                  >
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Full Name</th>
                        {/* <th>Avatar</th> */}
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Role</th>
                        <th>Create at</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.username}</td>
                          <td>{user.fullname}</td>
                          {/* <td>
                            <img height={30} src={user.avatar} alt="" />
                          </td> */}
                          <td>{user.number_phone}</td>
                          <td>{user.email}</td>
                          <td>{user.address}</td>
                          {/* <td>{user.role}</td> */}
                          <td
                            className="font-weight-bold"
                            style={{
                              color:
                                user.role === 1
                                  ? "red"
                                  : user.role === 2
                                  ? "blue"
                                  : "black",
                            }}
                          >
                            {(() => {
                              switch (user.role) {
                                case 1:
                                  return "Admin";
                                case 2:
                                  return "User";
                                default:
                                  return "Unknown";
                              }
                            })()}
                          </td>
                          <td>
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            <Space>
                              <EditUser
                                userId={user.id}
                                onEditUserSuccess={handleSuccess}
                              />
                              <Popconfirm
                                key={user.id}
                                title="Delete the user"
                                description="Are you sure to delete this user?"
                                onConfirm={() => confirm(user.id)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Button
                                  type="primary"
                                  style={{ backgroundColor: "#DC3545" }}
                                >
                                  <DeleteOutlined />
                                </Button>
                              </Popconfirm>
                            </Space>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {loading && <Spin size="large" />}
                  {!loading && users.length === 0 && (
                    <Empty description={false} />
                  )}
                  {totalUsers / 10 > 1 && (
                    <Pagination
                      style={{ marginTop: "20px" }}
                      pageSize={paramsFilter.limit}
                      total={totalUsers} // Total number of items
                      onChange={handlePagination}
                      current={paramsFilter.page}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="sticky-footer bg-white">
          <div className="container my-auto">
            <div className="copyright text-center my-auto">
              <span>Copyright © Your Website 2021</span>
            </div>
          </div>
        </footer>
      </div>
    </Fragment>
  );
};
