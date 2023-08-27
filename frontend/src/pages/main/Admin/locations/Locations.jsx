import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import CancelIcon from "@mui/icons-material/Close";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import axios from "axios";
import { url } from "../../../../global/Global.js";
import styles from "./Location.module.css";
import AddIcon from "@mui/icons-material/Add";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";

function Locations() {
  const[dataSend,setDataSend]=useState()
  const convertAndSubtractOneDay = (utcDateString) => {
    const utcDate = new Date(utcDateString);
    const previousDay = new Date(utcDate.getTime() ); // Trừ đi 1 ngày
    return previousDay.toLocaleDateString(); // Hoặc bạn có thể tùy chỉnh định dạng ngày tháng tại đây
  };
  const [update, setUpdate] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [weatherData, setWeatherData] = useState([]);
  const [weatherDataAdd, setWeatherDataAdd] = useState({
    locationId:"",
    date:"",
    weather_desc:"",
    temperature:"",
    humidity:"",
    windSpeed:"",
    visibility:"",
    air:"",
    uvIndex:"",
    rateRainy:"",
  });
  const handleEditDataClick =(id)=>{
    const dataUpdate = id.row;
    console.log(dataUpdate)
    setUpdate(dataUpdate)
    setDataSend({
      id:dataUpdate._id,
      date:formatDateToMMDDYYYY(dataUpdate.date)
    })
    setShowUpdateWeatherData(true)
  }
  useEffect(()=>{console.log(dataSend)},[dataSend])
  function formatDateToMMDDYYYY(date) {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  }
  
  const handleEditClick = (id) => {
    const userToEdit = id.row;
    console.log(userToEdit._id);
    setIsEditing(true);
    setWeatherDataAdd({locationId:userToEdit._id})
    setEditingLocation(userToEdit);
    fetchWeatherData(userToEdit._id);
  };
  const [dataEdit,setDataEdit]=useState()
  const [isEditing, setIsEditing] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showAddWeatherData, setShowAddWeatherData] = useState(false);
  const [showUpdateWeatherData, setShowUpdateWeatherData] = useState(false);
  const [locationInfo, setLocationInfo] = useState();
  const handleAddLocation = async () => {
    const token = localStorage.getItem("jwtToken");

    const headers = {
      Authorization: `Bearer ${token}`, // Thêm token vào header
    };

    try {
      const response = await axios.post(
        `${url}/api/v1/admin/addlocation`,
        locationInfo,
        { headers } // Truyền headers vào yêu cầu
      );

      setShowAddLocation(false);
      console.log(response.data.message);
      alert(response.data.message);
      fetchDataLocation(token);
      setLocationInfo({
        name: "",
        latitude: "",
        longitude: "",
        code: "",
      });
    } catch (error) {
      console.error("Error adding location:", error.response.data.message);
      alert(error.response.data.message);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLocationInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };
  const handleInputAddChange =(event) => {
    const { name, value } = event.target;
    setWeatherDataAdd((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };
 
  const handleInputUpdateChange =(event) => {
    const { name, value } = event.target;
    setDataSend((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log(weatherDataAdd);
  }, [weatherDataAdd]);
  const handleDeleteClick = (id) => {
    const userToDelete = id.row;
    console.log(id);
    if (window.confirm("Bạn có chắc chắn muốn xóa mục này?")) {
      deleteLocation(userToDelete);
    }
  };
  const handleDeleteWDClick = (id) => {
    const userToDelete = id.row;
    console.log(id);
    if (window.confirm("Bạn có chắc chắn muốn xóa mục này?")) {
      deleteWDLocation(userToDelete);
    }
  };
  const columnsWeather = [
    {
      field: "_id",
      headerName: "ID",
      flex: 0.8,
      headerClassName: "test",
    },
    {
      field: "weather_desc",
      headerName: "Weather Description",
      flex: 0.5,
      editable: true,
    },
    {
      field: "temperature",
      headerName: "Temperature",
      flex: 0.7,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.7,
      valueGetter: (params) => convertAndSubtractOneDay(params.row.date),
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
              handleEditDataClick(id);
            }}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteWDClick(id);
            }}
            color="inherit"
          />,
        ];
      },
    },
  ];
  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 0.8,
      headerClassName: "test",
    },
    {
      field: "name",
      headerName: "Location Name",
      flex: 0.5,
      editable: true,
    },
    {
      field: "code",
      headerName: "Nation Code",
      flex: 0.7,
    },
    {
      field: "latitude",
      headerName: "Latitude",
      flex: 0.7,
    },
    {
      field: "longitude",
      headerName: "Longitude",
      flex: 0.7,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 0.7,
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
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteClick(id);
            }}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const [locationData, setLocationData] = useState([]);
  const role = localStorage.getItem("role");
  const deleteLocation = async (user) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      if (jwtToken) {
        const response = await axios.delete(
          `${url}/api/v1/admin/deletelocation/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        alert("Xóa Location thành công");
        // Sau khi xóa thành công, gọi lại fetchDataUsers để cập nhật danh sách
        fetchDataLocation(jwtToken);
      }
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };
  const deleteWDLocation = async (user) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      if (jwtToken) {
        const response = await axios.delete(
          `${url}/api/v1/admin/deleteweatherdata/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        alert("Xóa dữ liệu thành công");
        // Sau khi xóa thành công, gọi lại fetchDataUsers để cập nhật danh sách
        fetchWeatherData(editingLocation._id);
      }
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  const fetchWeatherData = async (id) => {
    try {
      const token = localStorage.getItem("jwtToken");
      console.log(id);
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${url}/api/v1/admin/locations/weatherdata?locationId=${id}`,
        { headers }
      );

      setWeatherData(response.data.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData([])
    }
  };

  const fetchDataLocation = async (token) => {
    try {
      const response = await axios.get(`${url}/api/v1/admin/locations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLocationData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddWeatherDataClick = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const newDate = formatDateToMMDDYYYY(weatherDataAdd.date);
      const formattedWeatherData = {
        ...weatherDataAdd,
        date: newDate,
      };

      const response = await axios.post(
        `${url}/api/v1/admin/addweatherdata`,
        formattedWeatherData,
        { headers }
      );

      alert(response.data.message);
      // Thực hiện cập nhật dữ liệu sau khi thêm thành công
      // fetchDataWeatherInfo(token);
      fetchWeatherData(editingLocation._id);
    } catch (error) {
      console.error("Error adding weather info:", error.response.data.message);
      alert(error.response.data.message);
    }
  };
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      fetchDataLocation(jwtToken);
    }
  }, []);
  // useEffect(() => {
  //   const jwtToken = localStorage.getItem("jwtToken");
  //   if (jwtToken) {
  //     fetchDataLocation(jwtToken);
  //   }
  // }, [locationData]);
  const handleAddLocationClick = () => {
    setShowAddLocation(true);
  };
  const handleAddWeatherData = () => {
    setShowAddWeatherData(true);
  };
  const handleSaveClick = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      if (editingLocation && jwtToken) {
        const response = await axios.put(
          `${url}/api/v1/admin/updatelocation/${editingLocation._id}`,
          editingLocation,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        alert(response.data.message);
        // setIsEditing(false);
        fetchDataLocation(jwtToken);
      }
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };
  const handleUpdateClick = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      console.log("tesst")
      if (jwtToken) {
        const response = await axios.put(
          `${url}/api/v1/admin/updateweatherdata/${dataSend._id}`,
          dataSend,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );     
        if (response.status === 200) {
          alert(response.data.message);
          fetchWeatherData(editingLocation._id);
        } else {
          console.error("Failed to update weather data:", response.data.message);
          alert("Failed to update weather data.");
        }
      }
    } catch (error) {
      console.error("Error updating weather data:", error);
      alert("Error updating weather data.");
    }
  };
  
  
  return (
    <div>
      {role === "ADMIN" ? (
        <Box padding="0.5rem">
          <Box>
            <h3>List Users</h3>
          </Box>
          <button className={styles.addButton} onClick={handleAddLocationClick}>
            <AddIcon /> Add Location
          </button>
          <Box height="75vh" className={styles["table"]}>
            {isEditing ? (
              <div className={styles.editForm}>
                <h2>Edit Location</h2>

                <div>
                  <label>Location Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editingLocation.name}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Code:</label>
                  <input
                    type="text"
                    name="code"
                    value={editingLocation.code}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        code: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Latitude:</label>
                  <input
                    type="text"
                    name="latitude"
                    value={editingLocation.latitude}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        latitude: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label>Longitude:</label>
                  <input
                    type="text"
                    name="longitude"
                    value={editingLocation.longitude}
                    onChange={(e) =>
                      setEditingLocation({
                        ...editingLocation,
                        longitude: e.target.value,
                      })
                    }
                  />
                </div>
                <div className={styles["addUserBtn"]}>
                  <button type="button" onClick={handleSaveClick}>
                    Save
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </div>
                <button
                  className={styles.addButton}
                  onClick={handleAddWeatherData}
                >
                  <AddIcon /> Add Weather Data
                </button>
                <DataGrid
                  getRowId={(row) => row._id}
                  rows={weatherData || []}
                  columns={columnsWeather}
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
              </div>
            ) : (
              <DataGrid
                getRowId={(row) => row._id}
                rows={locationData || []}
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
              {showUpdateWeatherData && (
              <div className={styles["addUserForm"]} >
                <h3>Update Weather Data</h3>
                <form style={{display:'grid',gridTemplateColumns:'1fr 1fr',columnGap:"10px"}}>
                  <div>
                    <label>Id:</label>
                    <input
                      type="text"
                      name="date"
                      placeholder={update._id}
                      onChange={handleInputUpdateChange}
                    />
                  </div>
                  <div>
                    <label>Date:</label>
                    <input
                      type="text"
                      name="date"
                      value={formatDateToMMDDYYYY(update.date)}
                      onChange={handleInputUpdateChange}
                      readOnly
                    />
                  </div>
                  <div>
                    <label>Weather Description:</label>
                    <input
                      type="text"
                      name="weather_desc"
                      placeholder={update.weather_desc}
                      onChange={handleInputUpdateChange}
                    />
                  </div>
                  <div>
                    <label>Temperature:</label>
                    <input
                      type="text"
                      name="temperature"
                      placeholder={update.temperature}
                      onChange={handleInputUpdateChange}
                    />
                  </div>
                  <div>
                    <label>Wind Speed:</label>
                    <input
                      type="text"
                      name="windSpeed"
                      placeholder={update.windSpeed}
                      onChange={handleInputUpdateChange}
                    />
                  </div>
                  <div>
                    <label>Visibility:</label>
                    <input
                      type="text"
                      name="visibility"
                      placeholder={update.visibility}
                      onChange={handleInputUpdateChange}
                    />
                  </div>
                  <div>
                    <label>Air Quality:</label>
                    <input
                      type="text"
                      name="air"
                      placeholder={update.air}
                      onChange={handleInputUpdateChange}
                    />
                  </div>
                  <div>
                    <label>UV Index:</label>
                    <input
                      type="text"
                      name="uvIndex"
                      placeholder={update.uvIndex}
                      onChange={handleInputUpdateChange}
                    />
                  </div>
                  <div>
                    <label>Rate of Rainfall:</label>
                    <input
                      type="text"
                      name="rateRainy"
                      placeholder={update.rateRainy}
                      onChange={handleInputUpdateChange}
                    />
                  </div>
                  <div>
                    <label>Humidity:</label>
                    <input
                      type="text"
                      name="humidity"
                      placeholder={update.humidity}
                      onChange={handleInputUpdateChange}
                    />
                  </div>
                  <div className={styles["addUserBtn"]}>
                    <button type="button" onClick={handleUpdateClick}>
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUpdateWeatherData(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            {showAddWeatherData && (
              <div className={styles["addUserForm"]} >
                <h3>Add Weather Data</h3>
                <form style={{display:'grid',gridTemplateColumns:'1fr 1fr',columnGap:"10px"}}>
                  <div>
                    <label>Id:</label>
                    <input
                      type="text"
                      name="date"
                      value={editingLocation._id}
                      onChange={handleInputAddChange}
                    />
                  </div>
                  <div>
                    <label>Date:</label>
                    <input
                      type="date"
                      name="date"
                      value={weatherDataAdd.date}
                      onChange={handleInputAddChange}
                    />
                  </div>
                  <div>
                    <label>Weather Description:</label>
                    <input
                      type="text"
                      name="weather_desc"
                      value={weatherDataAdd.weather_desc}
                      onChange={handleInputAddChange}
                    />
                  </div>
                  <div>
                    <label>Temperature:</label>
                    <input
                      type="text"
                      name="temperature"
                      value={weatherDataAdd.windSpeed}
                      onChange={handleInputAddChange}
                    />
                  </div>
                  <div>
                    <label>Wind Speed:</label>
                    <input
                      type="text"
                      name="windSpeed"
                      value={weatherDataAdd.windSpeed}
                      onChange={handleInputAddChange}
                    />
                  </div>
                  <div>
                    <label>Visibility:</label>
                    <input
                      type="text"
                      name="visibility"
                      value={weatherDataAdd.visibility}
                      onChange={handleInputAddChange}
                    />
                  </div>
                  <div>
                    <label>Air Quality:</label>
                    <input
                      type="text"
                      name="air"
                      value={weatherDataAdd.air}
                      onChange={handleInputAddChange}
                    />
                  </div>
                  <div>
                    <label>UV Index:</label>
                    <input
                      type="text"
                      name="uvIndex"
                      value={weatherDataAdd.uvIndex}
                      onChange={handleInputAddChange}
                    />
                  </div>
                  <div>
                    <label>Rate of Rainfall:</label>
                    <input
                      type="text"
                      name="rateRainy"
                      value={weatherDataAdd.rateRainy}
                      onChange={handleInputAddChange}
                    />
                  </div>
                  <div>
                    <label>Humidity:</label>
                    <input
                      type="text"
                      name="humidity"
                      value={weatherDataAdd.humidity}
                      onChange={handleInputAddChange}
                    />
                  </div>
                  <div className={styles["addUserBtn"]}>
                    <button type="button" onClick={handleAddWeatherDataClick}>
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddWeatherData(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            {showAddLocation && (
              <div className={styles["addUserForm"]}>
                <form>
                  <h3>Add New User</h3>

                  <div>
                    <label>Location Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Code:</label>
                    <input
                      type="text"
                      name="code"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Latitude:</label>
                    <input
                      type="text"
                      name="latitude"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Longitude:</label>
                    <input
                      type="text"
                      name="longitude"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles["addUserBtn"]}>
                    <button type="button" onClick={handleAddLocation}>
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddLocation(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
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

export default Locations;
