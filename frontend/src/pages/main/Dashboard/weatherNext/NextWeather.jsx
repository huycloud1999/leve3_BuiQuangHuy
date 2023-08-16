import React from "react";
import {
  faSun, faCloud, faCloudShowersHeavy, faCloudBolt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from './WeatherNext.module.css';

function NextWeather({ color = "white", day, desc, temp }) {
  let icon;
  switch (desc) {
    case "Sunny":
      icon = <FontAwesomeIcon icon={faSun} style={{ color: color }} />;
      break;
    case "Cloudy":
      icon = <FontAwesomeIcon icon={faCloud} style={{ color: color }} />;
      break;
    case "Rainy":
      icon = <FontAwesomeIcon icon={faCloudShowersHeavy} style={{ color: color }} />;
      break;
    case "Storm":
      icon = <FontAwesomeIcon icon={faCloudBolt} style={{ color: color }} />;
      break;
    default:
      icon = null;
  }
  function formatDayMonth(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based
  
    return `${day}/${month}`;
  }
  const displayDay = day === formatDayMonth(new Date().toLocaleDateString()) ? "Now" : day;
  return (
    <div className={styles["main"]} style={{ border: `2px solid ${color}` }}>
      <span style={{ color: color }}>{displayDay}</span>
      {icon}
      <span style={{ color: color }}>{temp}°C </span>
    </div>
  );
}

export default NextWeather;
