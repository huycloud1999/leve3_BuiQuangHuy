import React from "react";
import WeatherInfo from "./weatherInfo/WeatherInfo";
import '../../../assets/animated/styles.css'
import styles from "./Dashboard.module.css";
import cloudy from '../../../assets/videos/cloudy.mp4'
import storm from '../../../assets/videos/storm.mp4'
import rainy from '../../../assets/videos/rainy.mp4'
import sunny from '../../../assets/videos/sunny.mp4'
import { Container, Row, Col } from "react-bootstrap";
import { ReactComponent as SunnyIcon } from "../../../assets/animated/cloudy-day-1.svg";
import { ReactComponent as RainIcon } from "../../../assets/animated/rainy-7.svg";
import { ReactComponent as CloudyIcon1 } from "../../../assets/animated/cloudy.svg";
import { ReactComponent as Storm } from "../../../assets/animated/thunder.svg";
import Temperature from "../../../components/icons/Temperature";
import NextWeather from "./weatherNext/NextWeather";
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../../global/Global.js";
import { useSelector } from "react-redux";
import { faTry } from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
  function getCurrentDate() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
  function formatDayMonth(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based
  
    return `${day}/${month}`;
  }
  const [weatherData, setWeatherData] = useState([]);
  const [weatherDataNext, setWeatherDataNext] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const locationIdGlobal = useSelector((state) => state.location.locationId);
  const locationIdLocal = localStorage.getItem("location");
  const [locationId, setLocationId] = useState("");

  useEffect(() => {
    if (!locationIdLocal) {
      setLocationId(locationIdGlobal);
    } else {
      setLocationId(locationIdLocal);
    }
  }, [locationIdGlobal, locationIdLocal]);

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
      
        localStorage.setItem("location",response.data.data.locationDefault)
        setLocationId(response.data.data.locationDefault)
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  const fetchDataNext = async(token)=>{
    try {
      const token = localStorage.getItem("jwtToken");
      if (locationId) { // Kiểm tra xem locationId đã có giá trị
        const response = await axios.post(
          `${url}/api/v1/user/weatherinfonext`,
          {
            locationId: locationId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWeatherDataNext(response.data.data)
  
      }
    } catch (error) {
      console.error("Error fetching weather info:", error);
    }
  }

  const fetchWeatherInfo = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (locationId) { // Kiểm tra xem locationId đã có giá trị
        const response = await axios.post(
          `${url}/api/v1/user/weatherinfo`,
          {
            locationId: locationId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWeatherData(response.data.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching weather info:", error);
      setIsLoading(true);
    }
  };
  

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    
    if (jwtToken) {
      fetchUserInfo(jwtToken);
    }
  }, []);
  useEffect(() => {
    fetchWeatherInfo();
    fetchDataNext();
  }, [locationId]);




  let weatherIcon;
  let videobg;
  let color;
  if (!weatherData) {
    setIsLoading(true); // Set the loading state if weatherData is not available
  } else {
    switch (weatherData[0]?.weather_desc) {
      case "Sunny":
        weatherIcon = <SunnyIcon/>;
        videobg = sunny;
        color ="#333866"
        break;
      case "Cloudy":
        weatherIcon = <CloudyIcon1/>;
        videobg = cloudy;
        color ="#333866"
        break;
      case "Rainy": // Make sure the value here matches the actual data
        weatherIcon = <RainIcon />;
        videobg=rainy
        color ="white"
        break;
      case "Storm":
        weatherIcon = <Storm />;
        videobg = storm
        color="white"
        break;
      default:
        weatherIcon = null;
        videobg = null;
        color=null
    }
  }

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <Container fluid className={styles["container"]}>
            
            <Row>
              <Col md="6" className={styles["weatherinfo-right"]} style={{color:color}}>
              <video src={videobg} autoPlay loop muted/>
                <div className={styles["locate"]} style={{color:color}}>
                  <h2 style={{textTransform:"uppercase",fontWeight:'bold'}}>{weatherData[0].locationId.name}</h2>
                  <span style={{color:color}}>{getCurrentDate()}</span>
                  <span style={{color:color}}>Latitude:{weatherData[0].locationId.latitude}</span>
                  <span style={{color:color}}>Longitude:{weatherData[0].locationId.longitude}</span>
                </div>
                <div>
                  <h4>Today</h4>
                  <div className={styles["weatherdetail"]}>
                    <div>{weatherIcon}</div>
                    <div className={styles["weatherdetail-icon"]}>
                      <div className={styles["weatherdetail-icon_tem"]}>
                        <span>{weatherData[0].temperature}</span>
                        <Temperature
                          color={color}
                          width={50}
                          height={50}
                        />
                      </div>
                      <span style={{color:color}}>{weatherData[0].weather_desc}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5>Next 7 days</h5>
                  <div className={styles["nextday"]}>
                    {weatherDataNext.map((section, index)=>
                      <NextWeather key={index} color={color}  day={formatDayMonth(section.date)} desc={section.weather_desc} temp={section.temperature} />
                    )}
                  
                
                  </div>
                </div>
              </Col>
              <Col md={6} className={styles["weatherinfo"]}>
                <WeatherInfo
                  title={"Humidity"}
                  detail={weatherData[0].humidity}
                  quality={weatherData[0].humidityQuality}
                />
                <WeatherInfo
                  title={"Wind Speed"}
                  detail={weatherData[0].windSpeed}
                  quality={weatherData[0].windSpeedQuality}
                />
                <WeatherInfo
                  title={"Visibility"}
                  detail={weatherData[0].visibility}
                  quality={weatherData[0].visibilityQuality}
                />
                <WeatherInfo
                  title={"Air Quality"}
                  detail={weatherData[0].air}
                  quality={weatherData[0].airQuality}
                />
                <WeatherInfo
                  title={"UV Index"}
                  detail={weatherData[0].uvIndex}
                  quality={weatherData[0].uvIndexQuality}
                />
                <WeatherInfo
                  title={"Rate Rainy"}
                  detail={weatherData[0].rateRainy}
                  quality={weatherData[0].rateRainyQuality}
                />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </div>
    
  );
}

export default Dashboard;
