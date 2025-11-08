import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function VideoSection() {
  return (
    <>
      <div
        className="container d-flex flex-column justify-content-center align-items-center vh-100"
        style={{
          background: "linear-gradient(135deg, #dbeafe 0%, #dbeafe 70%, #dcfce7 100%)",
          padding: "40px 32px",
          marginRight: "40px",
          marginLeft: "60px",
          
          borderRadius: "18px",
          boxShadow: "0 6px 32px rgba(37,99,235,0.09)",
          width: "100%",
        }}
      >
        <h1
          style={{
            color: "#2446a3",
            fontSize: "2.4rem",
            fontWeight: "900",
            marginBottom: "32px",
            textAlign: "left",
            width: "100%",
            fontFamily: "'Poppins', 'Montserrat', 'Segoe UI', Arial, sans-serif",
          }}
        >
          Problems We Try To Solve
        </h1>
        <div className="ratio ratio-16x9 w-75">
          <iframe
            src="https://www.youtube.com/embed/wkf-WxMZVP8?mute=1"
            title="YouTube video"
            allow="encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </>
  );
}

export default VideoSection;
