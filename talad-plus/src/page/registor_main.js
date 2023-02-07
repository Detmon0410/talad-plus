import React from "react";
import "./App.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import RoleSelect from "./componenet/Selector_role";

import Button from "@mui/material/Button";
function Registor() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="logo01.png" alt="logo" className="Picture" />
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "40ch" },
          }}
          noValidate
          autoComplete="off"
        >
          {" "}
          <p>
            <TextField id="username" label="Username" variant="filled" />
          </p>
          <p>
            <TextField id="password" label="Password" variant="filled" />
          </p>
          <p>
            <TextField
              id="confirmpassword"
              label="Confirm Password"
              variant="filled"
            />
          </p>
          <p>
            <TextField id="email" label="Email" variant="filled" />
          </p>
        </Box>

        <p>
          <RoleSelect></RoleSelect>
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
