import React from "react";

interface Props {
  width: number;
  height: number;
  backgroundColor: string;
}
const ArchedWindow: React.FC<Props> = ({ width, height, backgroundColor }) => {
  return (
    <div
      className="arch"
      style={{
        position: "relative",
        width: width,
        height: height,
        // backgroundColor: backgroundColor,
      }}
    >
      <div
        className="circle"
        style={{
          position: "absolute",
          borderRadius: "50%",
          top: 0,
          width: width,
          height: width,
          backgroundColor: backgroundColor,
        }}
      ></div>
      <div
        className="rectangle"
        style={{
          position: "absolute",
          top: width / 2,
          width: width,
          height: height - width / 2,
          backgroundColor: backgroundColor,
        }}
      ></div>
    </div>
  );
};

export default ArchedWindow;
