import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { saveUserInfo } from "../../../global/action";
import{url} from '../../../global/Global.js'
function Profile() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstname: null,
    surname: null,
    dateOfBirth: "",
    phoneNumber: null,
    gender: "",
    username: "",
    email: "",
    role: "",
    avatarUrl: "",
  });
  const [userInfoUpdate, setUserInfoUpdate] = useState({
    firstname: null,
    surname: null,
    dateOfBirth: "",
    phoneNumber: null,
    gender: "",
    username: "",
  });

  // Hàm để gọi API và lấy thông tin người dùng
  const fetchUserInfo = async () => {
    try {
      // Gọi API với token được lưu trong localStorage
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        `${url}/api/v1/auth/user-info`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
          },
        }
      );

      setUserInfo({
        firstname: response.data.data.firstname,
        surname: response.data.data.surname,
        dateOfBirth: response.data.data.dateOfBirth,
        phoneNumber: response.data.data.phoneNumber,
        gender: response.data.data.gender,
        username: response.data.data.username,
        email: response.data.data.authId.email,
        role: response.data.data.authId.role,
        avatarUrl: response.data.data.avatarUrl,
      });
      setUserInfoUpdate({
        firstname: response.data.data.firstname,
        surname: response.data.data.surname,
        dateOfBirth: response.data.data.dateOfBirth,
        phoneNumber: response.data.data.phoneNumber,
        gender: response.data.data.gender,
        username: response.data.data.username,
      });
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  // Hàm xử lý sự kiện khi nhấn nút "Change password"
  const handleChangePasswordClick = () => {
    setShowChangePasswordForm(true);
  };
  //change pass
  const [changePasswordForm, setChangePasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Hàm xử lý thay đổi giá trị của các trường trong form
  const [error, setError] = useState();
  const [errorSV, setErrorSV] = useState();
  const handleChangePasswordForm = (event) => {
    const { name, value } = event.target;
    setChangePasswordForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  const checkConfirmPassword = () => {
    if (changePasswordForm.newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return false;
    }
    if (
      changePasswordForm.newPassword !== changePasswordForm.confirmNewPassword
    ) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return false;
    }

    setError("");
    return true;
  };

  // Hàm xử lý khi submit form
  const handleSubmitForm = async (event) => {
    event.preventDefault();
    // Kiểm tra xác nhận mật khẩu mới trước khi gửi dữ liệu lên server
    if (!checkConfirmPassword()) {
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.put(
        `${url}/api/v1/user/updatepassword`,
        {
          oldPassword: changePasswordForm.oldPassword,
          newPassword: changePasswordForm.newPassword,
          confirmPassword: changePasswordForm.confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the response from the server (e.g., show success message)
      alert(response.data.message);
      setErrorSV("");
      setChangePasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error.response.data);
      setErrorSV(error.response.data.message);
    }
  };

  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Cập nhật giá trị ngày tháng khi người dùng thay đổi
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setUserInfoUpdate((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
  };
  const handleSaveAll = async () => {
    try {
      // Định dạng lại ngày tháng thành "mm/dd/yyyy"
      const formattedDateOfBirth = formatDateToMMDDYYYY(
        userInfoUpdate.dateOfBirth
      );

      // Gọi API để cập nhật thông tin người dùng
      const token = localStorage.getItem("jwtToken");
      await axios.put(
        `${url}/api/v1/user/update`,
        {
          firstname: userInfoUpdate.firstname,
          surname: userInfoUpdate.surname,
          dateOfBirth: formattedDateOfBirth,
          phoneNumber: userInfoUpdate.phoneNumber,
          gender: userInfoUpdate.gender,
          username: userInfoUpdate.username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Sau khi cập nhật thành công, cập nhật lại thông tin người dùng trong state userInfo
      setUserInfo({
        ...userInfo,
        firstname: userInfoUpdate.firstname,
        surname: userInfoUpdate.surname,
        dateOfBirth: formattedDateOfBirth,
        phoneNumber: userInfoUpdate.phoneNumber,
        gender: userInfoUpdate.gender,
        username: userInfoUpdate.username,
      });
      dispatch(saveUserInfo(userInfo.username));
      localStorage.setItem('username',userInfoUpdate.username);
      // Xóa thông tin trong state userInfoUpdate sau khi đã lưu thành công
      setUserInfoUpdate({
        firstname: null,
        surname: null,
        dateOfBirth: formattedDateOfBirth,
        phoneNumber: null,
        gender: "",
        username: "",
      });

      // Hiển thị thông báo hoặc thông báo thành công nếu cần thiết
      alert("Thay đổi đã được lưu thành công!");
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau!");
    }
  };
  //////////////////////////////img

  const handleEditAvatar = () => {
    setShowUpload(true);
  };
  


  // Hàm xử lý khi ấn nút Cancel trong phần Upload
  const handleCancelUpload = () => {
    setShowUpload(false);
    setSelectedImage(null); // Xóa hình ảnh đã chọn khỏi trạng thái (state)
  };
  const [selectedImage, setSelectedImage] = useState(null);

  // Xử lý sự kiện khi người dùng chọn tập tin ảnh
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);
    setSelectedImage(file);
  };  
  const [showUpload, setShowUpload] = useState(false);

  // Xử lý upload avatar khi người dùng nhấn nút "Upload Avatar"
  const handleUploadAvatar = async () => {
    try {
      if (selectedImage) {
        setIsLoading(true);
        // Tạo FormData để đóng gói tập tin ảnh đã chọn
        const formData = new FormData();
        formData.append("data", selectedImage);
        console.log(formData)
  
        // Gọi API để upload avatar lên server
        const token = localStorage.getItem("jwtToken");
        const response = await axios.post(
          `${url}/api/v1/user/updateavt`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data", // Cần đặt đúng header "Content-Type" khi gửi FormData
            },
          }
        );
        setUserInfo({
          ...userInfo,
          avatarUrl: response.data.data.avatarUrl,
        });
        dispatch(saveUserInfo(userInfo.username,userInfo.email,userInfo.avatarUrl));
        
        localStorage.setItem("avatarUrl", response.data.data.avatarUrl);
        alert("Avatar uploaded successfully!");
      } else {
        alert("Please select an image to upload!");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("An error occurred while uploading the avatar!");
    }finally {
      setIsLoading(false); // Khi upload xong (thành công hoặc thất bại), tắt loading
      setShowUpload(false)
    }
  };

  // Hàm định dạng ngày tháng thành "mm/dd/yyyy"
  const formatDateToMMDDYYYY = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  // Gọi API lấy thông tin người dùng khi component được render
  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className={styles["container"]}>
      <div className={styles["LeftProfile"]}>
        <h3>General information</h3>
        <div className={styles["LeftProfileInfo"]}>
          <div>
            <span>First Name</span>
            <input
              type="text"
              name="firstname"
              placeholder={
                userInfo.firstname === "" ? "First Name" : userInfo.firstname
              }
              value={userInfoUpdate.firstname || ""}
              onChange={handleDateChange}
            />
          </div>
          <div>
            <span>Surname</span>
            <input
              type="text"
              name="surname"
              placeholder={
                userInfo.surname === "" ? "Surname" : userInfo.surname
              }
              value={userInfoUpdate.surname || ""}
              onChange={handleDateChange}
            />
          </div>
          <div>
            <span>Date of Birth</span>
            <input
              type="date"
              name="dateOfBirth"
              value={formatDate(userInfoUpdate.dateOfBirth) || ""}
              onChange={handleDateChange}
            />
          </div>
          <div>
            <span>Phone Number</span>
            <input
              type="text"
              name="phoneNumber"
              placeholder={
                userInfo.phoneNumber === null
                  ? "Phone Number"
                  : userInfo.phoneNumber
              }
              value={userInfoUpdate.phoneNumber || ""}
              onChange={handleDateChange}
            />
          </div>
          <div>
            <span>Gender</span>
            <select
              name="gender"
              value={userInfoUpdate.gender || ""}
              onChange={handleDateChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            <span>UserName</span>
            <input
              type="text"
              name="username"
              placeholder={
                userInfo.username === "" ? "UserName" : userInfo.username
              }
              value={userInfoUpdate.username || ""}
              onChange={handleDateChange}
            />
          </div>
          <div>
            <span>Email</span>
            <input
              type="text"
              placeholder={userInfo.email === "" ? "Email..." : userInfo.email}
              disabled
              style={{ cursor: "not-allowed" }}
            />
          </div>
        </div>
        <div className={styles["btn"]}>
          <button onClick={handleSaveAll}>Save All</button>
          <button onClick={handleChangePasswordClick}>Change password</button>
        </div>
      </div>
      <div className={styles["RightProfile"]}>
        <label>Profile picture</label>
        <div className={styles["RightProfileInfo"]}>
          <div className={styles["Avatar"]}>
            <img src={userInfo.avatarUrl} alt="" />
            <div onClick={handleEditAvatar}>
              <FontAwesomeIcon icon={faPencil} />
              Edit
            </div>
          </div>
          {showUpload && (
            // Hiển thị phần Upload khi showUpload=true
            <div className={styles["Upload"]}>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <div className={styles["btn"]}>
                <button onClick={handleUploadAvatar}>{isLoading ? 'Uploading...' : 'Upload Avatar'} </button>
                <button onClick={handleCancelUpload}>Cancel</button>
              </div>
            </div>
          )}
          <div className={styles["RightProfileInfoUser"]}>
            <span>{userInfo.role}</span>
            <span>{userInfo.username}</span>
            <span>{userInfo.email}</span>
          </div>
        </div>
      </div>
      {showChangePasswordForm && (
        <div className={styles["changePasswordForm"]}>
          <form>
            <h3>Change Password</h3>
            <div>
              <label>Old Password:</label>
              <input
                type="password"
                name="oldPassword"
                value={changePasswordForm.oldPassword}
                onChange={handleChangePasswordForm}
                required
              />
              <span style={{ color: "red", fontSize: 15 }}>{errorSV}</span>
            </div>
            <div>
              <label>New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={changePasswordForm.newPassword}
                onChange={handleChangePasswordForm}
                required
              />
            </div>
            <div>
              <label>Confirm New Password:</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={changePasswordForm.confirmNewPassword}
                onChange={handleChangePasswordForm}
                required
              />
              <span style={{ color: "red", fontSize: 15 }}>{error}</span>
            </div>
            <div className={styles["changePasswordButtons"]}>
              <button type="submit" onClick={handleSubmitForm}>
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowChangePasswordForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Profile;
