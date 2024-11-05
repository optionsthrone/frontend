import React from "react";

const TrendChart = () => {
  // Map through the code 10 times and display the index in the number field
  const numbers = Array.from({ length: 11 }, (_, index) => index + 1);
  return (
    <>
      <div className="corp_tracker flex  ">
        {numbers.map((number, index) => (
          <div className="flex flex-col trend_style tchart" key={index}>
            <p className="trend_number">${(number - 1) * 10}</p>
            <div className="trend_container"></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TrendChart;

// 12.8%
