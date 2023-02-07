import React from "react";
import "./App.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import RoleSelect from "./componenet/Selector_address";
import Upload from "./componenet/ImageUp_MarketR";

import Button from "@mui/material/Button";
function Registor() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="Text-Style">ลงทะเบียนตลาด</h1>
        <Box component="form" noValidate autoComplete="off">
          {" "}
          <p>
            <TextField
              id="market_name"
              label="Market Name"
              variant="filled"
              sx={{ width: 300 }}
            />
          </p>
          <p>
            <TextField
              id="market_owner"
              label="Owner Name"
              variant="filled"
              sx={{ width: 300 }}
            />
          </p>
          <p>
            <TextField
              id="phone_number"
              label="Phone Number"
              variant="filled"
              sx={{ width: 300 }}
            />
          </p>
          <p>
            <TextField
              id="market_address"
              label="Market Address"
              variant="filled"
              sx={{ width: 300 }}
            />
          </p>
        </Box>
        <p>
          <RoleSelect></RoleSelect>
        </p>

        <p
          style={{
            fontSize: "12px",
            color: "#000000",
          }}
        >
          <h2>อัพโหลดรูปใบอนุญาตตลาด</h2>
          <Upload></Upload>
        </p>

        <p>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#ffc422",
              fontSize: "18px",
            }}
          >
            Next
          </Button>
        </p>
      </header>
    </div>
  );
}

export default Registor;
