import React from "react";
import styles from "./Sidebar.module.css";
import logo from "../../../assets/img/logo.png";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sidebarData,sidebarDataNoUser } from "./SidebarData"; // Import dữ liệu thanh bên từ tập tin SidebarData.js
import { Link,useLocation,Navigate, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { saveSelectedMenu } from "../../../global/action";
import { useSelector } from "react-redux";
import{url} from '../../../global/Global.js'

function Sidebar() {
  const dispatch = useDispatch();
  const location = useLocation(); 
  const navigate = useNavigate();
  const [avt,setAvt]= useState("")
  const [userNameNew,setUserNameNew]= useState("")
  const UserInfoNew = useSelector(state => state.userInfo);
  useEffect(() => {
    setAvt(localStorage.getItem("avatarUrl"));
    setUserNameNew(localStorage.getItem("username"))
  }, [UserInfoNew]);
  
  const handleMenuClick = (path, name) => {
    if (name === "Log out") {

      handleLogout(); 
      
      dispatch(saveSelectedMenu(path, name));
    }
  };
  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("avatarUrl");
      localStorage.removeItem("username");
      // localStorage.removeItem("location");
      localStorage.removeItem("role");
      setUserInfo({
        username: "",
        email: "",
      });
      dispatch(saveSelectedMenu("/Home", "Home"));
    }
  };
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    avatarUrl:"",
    role:""
  });

  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get(
        `${url}/api/v1/auth/user-info`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật state userInfo bằng cách truyền vào một đối tượng mới với các giá trị cập nhật.
      setUserInfo({
        ...userInfo,
        username: response.data.data.username,
        email: response.data.data.authId.email,
        avatarUrl:response.data.data.avatarUrl,
        role: response.data.data.authId.role,
      });
      localStorage.setItem("role",response.data.data.authId.role)
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  const isActiveMenu = (path) => {
    // Check if the current location matches the menu item's path
    return location.pathname === path;
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      fetchUserInfo(jwtToken);
    }
  }, []);
  return (
    <div className={styles["sidebar"]}>
      <div className={styles["top"]}>
        <img src={logo} alt="" />
        {localStorage.getItem("jwtToken") ? (
        // If JWT token exists, render sidebarData
        <div className={styles["menu"]}>
          {sidebarData.map((section, index) => (
            <div key={index}>
              <ul>
                {Object.values(section)[0].map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className={isActiveMenu(item.path) ? styles["active"] : ""}
                  >
                    <Link
                      to={item.path}
                      onClick={() => handleMenuClick(item.path, item.name)}
                    >
                      <FontAwesomeIcon icon={item.icon} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        // If JWT token doesn't exist, render sidebarDataNoUser
        <div className={styles["menu"]}>
          {sidebarDataNoUser.map((section, index) => (
            <div key={index}>
              <ul>
                {Object.values(section)[0].map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className={isActiveMenu(item.path) ? styles["active"] : ""}
                  >
                    <Link
                      to={item.path}
                      onClick={() => handleMenuClick(item.path, item.name)}
                    >
                      <FontAwesomeIcon icon={item.icon} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
          ))}
        </div>
      )}
      </div>
      {localStorage.getItem("jwtToken") ? (
        <div className={styles["user"]}>
          <img src={avt?avt:userInfo.avatarUrl} alt="" />

          <div className={styles["info"]}>
            <span>{userNameNew?userNameNew:userInfo.username}</span>
            <span>{userInfo.email}</span>
          </div>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </div>
      ) : null}
    </div>
  );
}

export default Sidebar;
