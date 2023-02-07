import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export default function BasicButtons() {
  return (
    <Stack>
      <Button
        variant="contained"
        style={{
          backgroundColor: "#ffc422",
          fontSize: "18px",
        }}
      >
        Login
      </Button>
    </Stack>
  );
}
