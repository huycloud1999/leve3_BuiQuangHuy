import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { saveLocation } from "../../../global/action";


import {
  faGear,
  faMagnifyingGlass,
  faBell,
  faBars,faMapPin
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sidebarData, sidebarDataNoUser } from "../sidebar/SidebarData"; // Đảm bảo thay đổi đường dẫn đến tệp chứa sidebarData
import { url } from "../../../global/Global.js";
import axios from "axios";

function Header() {
  const dispatch = useDispatch();
  const selectedMenu = useSelector((state) => state.selectedMenu);
  const [isSecondaryMenuOpen, setSecondaryMenuOpen] = useState(false);

  const handleSecondaryMenuToggle = () => {
    setSecondaryMenuOpen((prevOpen) => !prevOpen);
  };

  const [searchTerm, setSearchTerm] = useState(""); // State để lưu giá trị của ô search
  const [searchResults, setSearchResults] = useState([]); // State để lưu kết quả tìm kiếm
  const handleSearchClick = (id) => {
    dispatch(saveLocation(id));
    localStorage.setItem("location",id)
};
  const handlePinLocation= async (id)=>{
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        `${url}/api/v1/user/setlocation`,
        {
          locationId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
          alert("Đặt địa điểm mặc định thành công")
    } catch (error) {
      console.error("Error fetching weather info:", error);
    }
  }
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        `${url}/api/v1/user/search`,
        {
          name: searchTerm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const locations = response.data.data;
      setSearchResults(locations);
    } catch (error) {
      console.error("Error fetching weather info:", error);
    }
  };
  useEffect(() => {
    handleSearch();
  }, [searchTerm]);
  return (
    <div className={styles["header"]}>
      <div className={styles["title"]}>
        <h2>{selectedMenu.name}</h2>
        <span> {selectedMenu.path}</span>
      </div>
      <div className={styles["rightHeader"]}>
        <div>
          <div className={styles["searchBar"]}>
            <input
              type="text"
              placeholder="Search.."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
          {searchTerm && ( // Kiểm tra searchTerm có giá trị
            <ul className={styles["searchResults"]}>
              {searchResults.length === 0 ? (
                <li>Không tìm thấy</li>
              ) : (
                searchResults.map((location) => (
                  <li key={location._id} onClick={() => handleSearchClick(location._id)} style={{textTransform:"uppercase"}}>
                  {location.name}
                  <button onClick={() => handlePinLocation(location._id)}><FontAwesomeIcon icon={faMapPin} /></button>
                </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div className={styles["icons"]}>
          <FontAwesomeIcon icon={faGear} />
          <FontAwesomeIcon icon={faBell} />

          {/* Menu thứ cấp */}
          <FontAwesomeIcon
            icon={faBars}
            className={styles["bar"]}
            onClick={handleSecondaryMenuToggle}
          />
          {isSecondaryMenuOpen && (
            <div className={styles["secondaryMenu"]}>
              {localStorage.getItem("jwtToken") ? (
                // If JWT token exists, render sidebarData
                <div className={styles["menu"]}>
                  {sidebarData.map((section, index) => (
                    <div key={index}>
                      <ul>
                        {Object.values(section)[0].map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <Link to={item.path}>
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
                          <li key={itemIndex}>
                            <Link to={item.path}>
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
