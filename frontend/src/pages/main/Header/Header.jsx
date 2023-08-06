import React, { useState } from "react";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  faGear,
  faMagnifyingGlass,
  faBell,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sidebarData } from "../sidebar/SidebarData"; // Đảm bảo thay đổi đường dẫn đến tệp chứa sidebarData

function Header() {
  const selectedMenu = useSelector(state => state.selectedMenu);
  const [isSecondaryMenuOpen, setSecondaryMenuOpen] = useState(false);

  const handleSecondaryMenuToggle = () => {
    setSecondaryMenuOpen((prevOpen) => !prevOpen);
  };

  return (
    <div className={styles["header"]}>
      <div className={styles["title"]}>
        <h2>{selectedMenu.name}</h2>
        <span> {selectedMenu.path}</span>
      </div>
      <div className={styles["rightHeader"]}>
        <div className={styles["searchBar"]}>
          <input type="text" placeholder="Search.." />
          <button>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
