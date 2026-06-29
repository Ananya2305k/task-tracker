import React from "react";
const Loader = ({ text = "Loading..." }) => (
  <div className="loader-wrapper"><div className="spinner" /><p className="loader-text">{text}</p></div>
);
export default Loader;
