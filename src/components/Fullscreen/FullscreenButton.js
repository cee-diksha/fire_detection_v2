import React, { useState } from "react";
import { Tooltip } from "@mui/material";

const FullscreenButton = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error("Error attempting to exit full-screen mode:", err);
      });
    }
  };

  return (
    <Tooltip title="Fullscreen">
      <div onClick={toggleFullscreen} className="header-icon-div">
        <img src="/static/images/fullscreen.svg" alt=""/>
      </div>
    </Tooltip>
      
  );
};

export default FullscreenButton;
