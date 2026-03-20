import React from "react";
import { RotatingLines } from "react-loader-spinner";

const Loader = ({ width }) => {
  return (
    <div className="self-center">
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width={width}
        visible={true}
      />
    </div>
  );
};
export default Loader;
