import React from 'react'

function Locations() {
  const role = localStorage.getItem("role");
  return (
    <div>
      {role === "ADMIN" ? (
        <div>Location</div>
      ) : (
        <h1 style={{color:'red',textAlign:'center',paddingTop:'10rem'}}>You do not have permission.</h1>
      )}
    </div>
  )
}

export default Locations