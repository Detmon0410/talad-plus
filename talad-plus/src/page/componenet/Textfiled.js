import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function BasicTextFields() {
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
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
    </Box>
  );
}
