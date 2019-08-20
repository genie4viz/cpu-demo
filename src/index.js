import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from './App';

export const ENABLE_CONCURRENT_AND_SCHEDULED = true;

const container = document.getElementById("root");

if (ENABLE_CONCURRENT_AND_SCHEDULED) {  
  const root = ReactDOM.unstable_createRoot(container);
  root.render(<StrictMode><App /></StrictMode>);
}else{
  ReactDOM.render(<App />, container);
}
