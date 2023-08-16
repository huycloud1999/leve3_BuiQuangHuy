import React, { useEffect, useState } from 'react'
import geoData from '../../../global/geoData.js'
import { MapContainer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import data from './Data.js'
import axios from 'axios';
// Import CSS for leaflet
import { url } from "../../../global/Global.js";
function Location() {
  const geojsonStyle = {
    fillColor: 'blue',  // Màu nền bên trong đối tượng GeoJSON
    weight: 0.5,          // Độ dày của đường viền
    color: 'white',     // Màu của đường viền
    fillOpacity: 0.5    // Độ trong suốt của nền bên trong
  };
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();
  const fetchWeatherInfo = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        `${url}/api/v1/user/map`, // Sử dụng axios.get thay vì axios.post
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching weather info:", error);
      setIsLoading(false); // Nên đặt setIsLoading(false) ở đây để cả trường hợp lỗi cũng dừng loading.
    }
  };

  const handleCountryHover = (e) => {
    const countryId = e.layer.feature.id || e.layer.feature.properties.name;
    const haha = data.find(item => item.name === countryId || item.id === countryId);
    
    e.layer.setStyle({
      weight: 1,
      color: 'red',
      fillColor: 'red'
    });
    if(haha){
    e.layer.bindTooltip(
      `Name:${e.layer.feature.properties.name||"N/a"}<br /> Weather: ${haha.Weather||"N/a"}<br />Temperature: ${haha.temperature||"N/a"}°C`
    ).openTooltip();}
    else{
      e.layer.bindTooltip(
        `Name:${e.layer.feature.properties.name||"N/a"}<br /> Weather: N/a<br />Temperature:N/a°C`
      ).openTooltip();
    }
  };

  const handleCountryLeave = (e) => {
    e.layer.setStyle(geojsonStyle);
    e.layer.closeTooltip();
  };
  useEffect(() => {
  }, [data]);
  useEffect(() => {
    fetchWeatherInfo();
  }, []);
  return (
<div>
      <h3>Location</h3>
      
      <div style={{ width: '100%', height: '80vh', padding: '1rem', marginTop: '1rem' }}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <MapContainer center={[14.0583, 108.2772]} zoom={5} style={{ width: '100%', height: '100%',borderRadius:'0.5rem'}}>
          <GeoJSON
            data={geoData.features}
            style={geojsonStyle}
            eventHandlers={{
              mouseover: handleCountryHover,
              mouseout: handleCountryLeave
            }}
          />
        </MapContainer>
        )}
      </div>
    </div>
  )
}

export default Location