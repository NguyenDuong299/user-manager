import { useState, useMemo, useEffect } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { User } from "../../components/user.type";
import { BASE_URL } from "../../axios/axios";

export function Demo() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [paramsFilter, setParamsFilter] = useState({
    username: "",
    role: 0,
    limit: 10,
    page: 1,
  });
  // Function to fetch users from API
  const fetchUsers = () => {
    axios
      .get(`${BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          username: searchTerm // Pass searchTerm as query parameter to filter users
        }
      })
      .then((res) => {
        setUsers(res.data.user.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Debounced handleChange function
  const debouncedResults = useMemo(() => {
    return debounce((value: string) => {
      setSearchTerm(value);
    }, 500);
  }, []);

  // Effect to fetch users when searchTerm changes
  useEffect(() => {
    fetchUsers();
    return () => {
      debouncedResults.cancel();
    };
  }, [searchTerm]); // Include searchTerm as a dependency

  // Render function
  return (
    <div className="App">
      <h1>Fruit Stand</h1>
      <input
        type="text"
        defaultValue={1}
        onChange={(e) => debouncedResults(e.target.value)}
        placeholder="Search users..."
      />
      <div>
        {users.map((user) => (
          <ul key={user.id}>
            <li>ID: {user.id}</li>
            <li>Username: {user.username}</li>
            <li>Full Name: {user.fullname}</li>
            <li>Phone Number: {user.number_phone}</li>
            <li>Email: {user.email}</li>
            <li>Address: {user.address}</li>
            <li
              className="font-weight-bold"
              style={{
                color: user.role === 1 ? "red" : user.role === 2 ? "blue" : "black",
              }}
            >
              {user.role === 1 ? "Admin" : user.role === 2 ? "User" : "Unknown"}
            </li>
            <li>Created At: {new Date(user.created_at).toLocaleDateString()}</li>
          </ul>
        ))}
      </div>
    </div>
  );
}
