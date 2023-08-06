import React from "react";
import WeatherInfo from "./weatherInfo/WeatherInfo";
import styles from "./Dashboard.module.css";

import { Container, Row, Col } from "react-bootstrap";
import SunnyIcon from "../../../components/icons/SunnyIcon";
import Temperature from "../../../components/icons/Temperature";
import NextWeather from "./weatherNext/NextWeather";

function Dashboard() {
  function getCurrentDate() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();

    return `${day}/${month}/${year}`;
  }

  return (
    <div >
      <Container fluid className={styles["container"]}>
        <Row>
  
          <Col md="6" className={styles["weatherinfo-right"]}>
            <div className={styles["locate"]}>
              <h3>Ha Noi</h3>
              <span>{getCurrentDate()}</span>
              <span>Latitude:21.0278°</span>
              <span>Longitude:21.0278°</span>
            </div>
            <div>
              <h4>Today</h4>
              <div className={styles["weatherdetail"]}>
                <div>
                  <SunnyIcon width={130} height={130} />
                </div>
                <div className={styles["weatherdetail-icon"]}>
                  <div className={styles["weatherdetail-icon_tem"]}>
                    <span>19</span>
                    <Temperature styles={{ color: "black" }} width={50} height={50} />
                  </div>
                  <span>Sunny</span>
                </div>
              </div>
            </div>

            <div>
              <h5>Next 7 days</h5>
              <div className={styles["nextday"]}>
                <NextWeather />
                <NextWeather />
                <NextWeather />
                <NextWeather />
                <NextWeather />
                <NextWeather />
                <NextWeather />
              </div>
            </div>
          </Col>
          <Col md={6} className={styles["weatherinfo"]}>
            <WeatherInfo />
            <WeatherInfo />
            <WeatherInfo />
            <WeatherInfo />
            <WeatherInfo />
            <WeatherInfo />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
