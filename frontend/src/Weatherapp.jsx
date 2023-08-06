import React from 'react'
import Homepage from './pages/main/homePage/Homepage';
import { Outlet } from 'react-router-dom';
function Weatherapp() {
  return (
    <div>
        <Outlet></Outlet>
    </div>
  )
}

export default Weatherapp