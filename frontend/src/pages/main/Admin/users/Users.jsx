import React from "react";
import { useEffect, useState } from "react";
import { url } from "../../../../global/Global.js";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import axios from "axios";
import styles from "./users.module.css";
function Users() {
  const role = localStorage.getItem("role");
  const [usersData, setUsersData] = useState([]);
  const [updateData, setUpdateData] = useState();
  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setEditingUser((prevUser) => ({
      ...prevUser,
      authId: {
        ...prevUser.authId,
        role: newRole,
      },
    })
    );
    setUpdateData((prevUser) => ({
      ...prevUser,
      role: newRole,
    }))
  };
  const handleGenderChange = (e) => {
    const newGender= e.target.value;
    setEditingUser((prevUser) => ({
      ...prevUser,
      gender: newGender,
    }))
    setUpdateData((prevUser) => ({
      ...prevUser,
      gender: newGender,
    }))
  };
  
  const handleEditClick = (id) => {
    const userToEdit = id.row;
    setEditingUser(userToEdit);
    setIsEditing(true);
  };
  const formatDateToMMDDYYYY = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setEditingUser((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
    setUpdateData((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: formatDateToMMDDYYYY(value),
    }));
  };
  const fetchDataUsers = async (token) => {
    try {
      const response = await axios.get(`${url}/api/v1/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsersData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSaveChanges = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      if (jwtToken && editingUser) {
        const response = await axios.put(
          `${url}/api/v1/admin/updateuser/${editingUser.authId._id}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        alert("Cập nhật dữ liệu thành công")
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      fetchDataUsers(jwtToken);
    }
  }, []);
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      fetchDataUsers(jwtToken);
    }
  }, [isEditing]);
  useEffect(() => {
    console.log(updateData);
  }, [updateData]);

  const columns = [
    {
      field: "authId._id",
      headerName: "ID",
      flex: 0.8,
      renderCell: (params) => {
        return params.row.authId._id;
      },
      headerClassName: "test",
    },
    {
      field: "firstname",
      headerName: "Name",
      flex: 0.5,
      editable: true,
    },
    {
      field: "authId.email",
      headerName: "Email",
      flex: 0.7,
      renderCell: (params) => {
        return params.row.authId.email;
      },
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.7,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 0.6,
      valueFormatter: (params) => new Date(params?.value).toLocaleString(),
    },
    {
      field: "authId.role",
      headerName: "Role",
      flex: 0.4,
      renderCell: (params) => {
        return params.row.authId.role;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 0.5,
      cellClassName: "actions",
      getActions: (id) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            color="inherit"
            onClick={(event) => {
              event.stopPropagation();
              handleEditClick(id);
            }}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            color="inherit"
          />,
        ];
      },
    },
  ];
  const handleCancelEdit = () => {
    setEditingUser(null);
    setIsEditing(false);
  };
  
  return (
    <div>
      {role === "ADMIN" ? (
        <Box padding="0.5rem">
          <Box>
            <h3>Users</h3>
            <h5>List Users</h5>
          </Box>
          <Box height="75vh" className={styles["table"]}>
            {isEditing ? (
              <div className={styles.editForm}>
                <h2>Edit User</h2>
                <form className={styles.Form}>
                  <label>Id: </label>
                  <input
                    type="text"
                    value={editingUser.authId._id}
                    readOnly // Để ngăn người dùng chỉnh sửa trường này
                  />
                  <label>First name: </label>
                  <input
                    type="text"
                    placeholder={editingUser.firstname}
                    onChange={(e) =>
                      setUpdateData((prevUser) => ({
                        ...prevUser,
                        firstname: e.target.value,
                      }))
                    }
                  />
                  <label>Surname: </label>
                  <input
                    type="text"
                    placeholder={editingUser.surname}
                    onChange={(e) =>
                      setUpdateData((prevUser) => ({
                        ...prevUser,
                        surname: e.target.value,
                      }))
                    }
                  />
                  <label>DateOfBirth: </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formatDate(editingUser.dateOfBirth) || ""}
                    onChange={handleDateChange}
                  />
                  <label>PhoneNumber: </label>
                  <input
                    type="text"
                    placeholder={editingUser.phoneNumber}
                    onChange={(e) =>
                      setUpdateData((prevUser) => ({
                        ...prevUser,
                        phoneNumber: e.target.value,
                      }))
                    }
                  />
                  <label>UserName: </label>
                  <input
                    type="text"
                    placeholder={editingUser.username}
                    onChange={(e) =>
                      setUpdateData((prevUser) => ({
                        ...prevUser,
                        username: e.target.value,
                      }))
                    }
                  />
                  <div className={styles.selectWrapper}>
                    <label>Gender: </label>
                    <select
                      name="gender"
                      value={editingUser.gender || ""}
                      onChange={handleGenderChange}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div className={styles.selectWrapper}>
                    <label>Role: </label>
                    <select
                      name="role"
                      value={editingUser.authId.role} // Không cần thay đổi giá trị này
                      onChange={handleRoleChange}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="MEMBER">MEMBER</option>
                    </select>
                  </div>
                </form>
                <div className={styles.buttonGroup}>
                  <button onClick={handleCancelEdit}>Cancel</button>
                  <button onClick={handleSaveChanges}>Save</button>
                </div>
              </div>
            ) : (
              <DataGrid
                getRowId={(row) => row._id}
                rows={usersData || []}
                columns={columns}
                sx={{
                  "& .MuiDataGrid-row": {
                    backgroundColor: "white",
                    borderBottom: "1px solid #f2f2f2",
                    "&:hover": {
                      backgroundColor: "#CCCCFF",
                    },
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#333866",
                    color: "white",
                    fontWeight: "bold",
                  },
                  "& .actions": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    backgroundColor: "#333866",
                    color: "white",
                  },
                  "& .MuiToolbar-root": {
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                }}
              />
            )}
          </Box>
        </Box>
      ) : (
        <h1 style={{ color: "red", textAlign: "center", paddingTop: "10rem" }}>
          You do not have permission.
        </h1>
      )}
    </div>
  );
}

export default Users;
