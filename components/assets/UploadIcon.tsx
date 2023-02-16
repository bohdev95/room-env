"use client";
import React from "react";
import styled from "styled-components";

interface Props {
  width: number | string;
  height?: number | string;
  arrowColor: string;
  fillColor: string;
  backgroundColor: string;
  handleClick?: () => void;
}
const UploadIcon: React.FC<Props> = ({
  width,
  height,
  arrowColor,
  fillColor,
  backgroundColor,
  handleClick,
}) => {
  return (
    <div
      style={{
        width: width,
        height: height,
        aspectRatio: 1 / 1,
        borderRadius: "50%",
        backgroundColor: backgroundColor,
        display: "flex",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <svg
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        height="90%"
        width="80%"
        x="0px"
        y="0px"
        viewBox="0 0 343.432 343.432"
      >
        <g>
          <path
            fill={fillColor ? fillColor : "#000"}
            d="M298.035,151.536c0.159-2.158,0.242-4.338,0.242-6.536c0-48.412-39.245-87.658-87.657-87.658
		c-29.496,0-55.589,14.569-71.477,36.903c-4.929-1.111-10.048-1.716-15.311-1.716c-33.779,0-61.909,24.133-68.122,56.095
		C23.938,154.988,0,183.034,0,216.678c0,38.335,31.077,69.412,69.412,69.412H274.02c38.336,0,69.412-31.077,69.412-69.412
		C343.432,186.785,324.534,161.31,298.035,151.536z"
          />
          <polygon
            fill={arrowColor ? arrowColor : "#fff"}
            points="197.642,244.478 197.649,169.298 223.093,169.299 175.527,121.732 127.961,169.298 
		153.408,169.298 153.408,244.478 	"
          />
        </g>
      </svg>
    </div>
  );
};

export default UploadIcon;
