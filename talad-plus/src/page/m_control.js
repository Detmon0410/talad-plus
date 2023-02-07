import React from "react";
import "./App.css";
import Appbar from "./componenet/Appbar";
import CssBaseline from "@mui/material/CssBaseline";

import Tabbar from "./componenet/Tabbar_MarketManager";

function Registor() {
  return (
    <div className="App">
      <Appbar></Appbar>
      <React.Fragment>
        <CssBaseline />

        <h1 className="App-header-page">ตลาดนัดบางวัน(Bang One Market)</h1>

        <Tabbar></Tabbar>
      </React.Fragment>
    </div>
  );
}

export default Registor;
