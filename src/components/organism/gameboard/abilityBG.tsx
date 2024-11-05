import React from "react";

export interface SvgProps {
  xmlns?: string;
  xmlnsXlink?: string;
}
const AbilityBg = ({ text, color }: { text?: string; color?: string }) => {
  return (
    <div
      className="ability-bg"
      // style={{
      //   transform: `${text === "" ? "rotate(90deg)" : ""}`,
      // }}
    >
      {/* <svg
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          fill="#00000017"
          stroke="white"
          strokeWidth="3"
          points="50 1 95 25 95 75 50 99 5 75 5 25"
          // transform="rotate(30 50 50)"
        />
        <foreignObject x="0" y="20" width="100%" height="100%">
          <p> {text ? text : ""} </p>
        </foreignObject>
      </svg> */}
      <svg
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 184.751 184.751"
        // style={{
        //   enableBackground: "new 0 0 184.751 184.751",
        // }}
        xmlSpace="preserve"
        fill={color ? color : "#00000017"}
        stroke="white"
        strokeWidth={4}
        // {...props}
      >
        <path d="M0,92.375l46.188-80h92.378l46.185,80l-46.185,80H46.188L0,92.375z" />
        <foreignObject x="0" y="20" width="100%" height="100%">
          <p style={{ fontSize: "2.5rem", paddingTop: "1rem" }}>
            {" "}
            {text ? text : ""}{" "}
          </p>
        </foreignObject>
      </svg>
    </div>
  );
};

export default AbilityBg;
