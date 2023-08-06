import React from 'react'
import styles from './WeatherInfo.module.css'
function WeatherInfo() {
  return (
    <div className={styles['container']} >
        <h3>Weather Title</h3>
        <span>Detail</span>
        <span>Quality</span>
    </div>
  )
}

export default WeatherInfo