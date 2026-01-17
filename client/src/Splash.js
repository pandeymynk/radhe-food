import React, { useState } from "react";
import "./Splash.css";

function Splash({ onFinish }) {
  React.useEffect(() => {
    const timer = setTimeout(onFinish, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-bg">
      <div className="splash-content">
        <div className="splash-logo">
          <span role="img" aria-label="food" style={{ fontSize: 60 }}>
            🍽️
          </span>
        </div>
        <div className="splash-title">Radhe Foods</div>
        <div className="splash-tag">Delicious. Fast. Local.</div>
      </div>
    </div>
  );
}

export default Splash;
