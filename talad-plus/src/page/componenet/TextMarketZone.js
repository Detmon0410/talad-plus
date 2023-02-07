import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

export default function BasicTextFields() {
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "10ch" },
      }}
      noValidate
      autoComplete="off"
    >
      {" "}
      <TextField
        required
        id="zone"
        label="Zone"
        variant="outlined"
        size="small"
      />
      <TextField
        type="number"
        required
        id="start"
        label="Start"
        variant="outlined"
        size="small"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        type="number"
        required
        id="start"
        label="End"
        variant="outlined"
        size="small"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        required
        type="number"
        id="end"
        label="Prize"
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: <InputAdornment position="start">฿</InputAdornment>,
        }}
      />
      <p></p>
    </Box>
  );
}
