"use client";
import React from "react";

interface Props {
  shift: number;
  flip?: boolean;
  color: string;
  children: JSX.Element;
}
const Background: React.FC<Props> = ({ shift, flip, color, children }) => {
  let backgroundImage;
  if (flip && flip === true) {
    backgroundImage = color
      ? `linear-gradient(45deg, ${color} ${shift ? shift : 50}%, #fff ${
          shift ? shift : 50
        }%)`
      : `linear-gradient(45deg, #fde3d6 ${shift ? shift : 50}%, #fff ${
          shift ? shift : 50
        }%)`;
  } else {
    backgroundImage = color
      ? `linear-gradient(45deg, #fff ${shift ? shift : 50}%,${color} ${
          shift ? shift : 50
        }%)`
      : `linear-gradient(45deg, #fff ${shift ? shift : 50}%,  #fde3d6  ${
          shift ? shift : 50
        }%)`;
  }

  return (
    <div
      className="wholeBackground"
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        backgroundImage: backgroundImage,
        // backgroundImage: `-webkit-${backgroundImage}`,
        zIndex: "-10",
        overflowY: "scroll",
        // opacity: opacity ? opacity : 1,
      }}
    >
      {children}
    </div>
  );
};

export default Background;
