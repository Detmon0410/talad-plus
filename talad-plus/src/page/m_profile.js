import React from "react";
import "./App.css";
import Appbar from "./componenet/Appbar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Tabbar from "./componenet/Tabbar_Market";
import Button from "@mui/material/Button";

function Registor() {
  return (
    <div className="App">
      <Appbar></Appbar>

      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm">
          <Box
            sx={{
              bgcolor: "#cfe8fc",
              height: "20vh",
              width: "100%",
            }}
          />
          <h1 className="App-header-page">ตลาดนัดบางวัน(Bang One Market)</h1>
          <p>
            <Box
              sx={{
                "& > legend": { mt: 2 },
              }}
            >
              <Typography component="legend"></Typography>
              <Rating name="no-value" value={null} />
            </Box>
          </p>
          <TextField
            id="outlined-multiline-static"
            label="About"
            multiline
            rows={4}
            defaultValue="Infomation About Market"
            sx={{ width: "100%" }}
            disabled
          />
          <Tabbar></Tabbar>
          <p>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#ffc422",
                fontSize: "18px",
                md: 2,
              }}
            >
              จองตลาด
            </Button>
          </p>
        </Container>
      </React.Fragment>
    </div>
  );
}

export default Registor;
