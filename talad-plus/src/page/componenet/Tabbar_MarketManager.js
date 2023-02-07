import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Upload from "./ImageUp_MarketR";
import DateSet from "./Time_Market";
import ZoneSet from "./TextMarketZone";
import TextField from "@mui/material/TextField";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{ borderBottom: 1, borderColor: "divider" }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="กำหนดพื้นที่เช่า" {...a11yProps(0)} />
          <Tab label="จัดการตลาด" {...a11yProps(1)} />
          <Tab label="การแจ้งเตือน" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        อัพโหลดแผนผังตลาด
        <Upload></Upload>
        <p></p>
        กำหนดวันของตลาด
        <Box display="flex" justifyContent="center" alignItems="center">
          <p>
            <DateSet></DateSet>
          </p>
        </Box>
        <p>กำหนด โซน/เริ่มต้น/สิ้นสุด/ราคาค่าเช่า</p>
        <Box display="flex" justifyContent="center" alignItems="center">
          <ZoneSet></ZoneSet>
        </Box>
        <Button
          variant="outlined"
          size="small"
          style={{
            outlineColor: "blue",
            fontSize: "15px",
          }}
        >
          เพิ่มโซน
        </Button>
        <p>ใส่รายละเอียดเกี่ยวกับสัญญา</p>
        <TextField
          id="outlined-multiline-static"
          label="About"
          multiline
          rows={6}
          defaultValue="Infomation About Market"
          sx={{ width: "80%" }}
        />
        <p>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#ffc422",
              fontSize: "18px",
              md: 2,
            }}
          >
            เพยแพร่
          </Button>
        </p>
      </TabPanel>
      <TabPanel value={value} index={1}>
        รายการที่เปิดเช่า
      </TabPanel>
      <TabPanel value={value} index={2}>
        โปรโมชั่น
      </TabPanel>
    </Box>
  );
}
