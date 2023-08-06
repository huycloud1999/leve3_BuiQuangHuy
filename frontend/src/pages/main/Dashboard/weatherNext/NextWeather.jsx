import React from "react";
import {
 faSun
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import styles from './WeatherNext.module.css'
function NextWeather() {
  return (
    <div className={styles["main"]}>
      <span>Now</span>
      <FontAwesomeIcon icon={faSun} />
      <span>19°C</span>
    </div>
  );
}

export default NextWeather;
