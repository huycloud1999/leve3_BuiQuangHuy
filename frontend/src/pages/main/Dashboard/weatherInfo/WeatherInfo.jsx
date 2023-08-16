import React from 'react'
import styles from './WeatherInfo.module.css'
function WeatherInfo({ title, detail, quality }) {
  let qualityColorClass;

  if (quality === 'Low') {
    qualityColorClass ="low"; // Tên class trong CSS module của màu vàng
  } else if (quality === 'High') {
    qualityColorClass ="high"; // Tên class trong CSS module của màu đỏ
  }
  return (
    <div className={styles.container}>
      <h3>{title}</h3>
      <span className={styles[qualityColorClass]}>{detail}</span>
      <span className={styles[qualityColorClass]}>{quality}</span>
    </div>
  );
}

export default WeatherInfo