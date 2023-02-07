import React from "react";
import "./App.css";
import Appbar from "./componenet/Appbar";
import Tabs from "./componenet/Tabbar_Home";

function Registor() {
  return (
    <div className="App">
      <Appbar></Appbar>
      <Tabs></Tabs>
    </div>
  );
}

export default Registor;
