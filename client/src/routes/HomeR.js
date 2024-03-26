import React from "react";

function HomeR() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <img src="/mafialogo.svg" 
        alt="logo" 
        className="img-fluid"
        style={{ 
          objectFit: 'cover',
          maxHeight: "700px" 
        }}
      />
    </div>
  );
};
  
export default HomeR;