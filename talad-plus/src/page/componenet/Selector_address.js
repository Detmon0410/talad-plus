import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect() {
  const [District, setDistrict] = React.useState("");
  const [Province, setProvince] = React.useState("");
  const [PostNunber, setPostNumber] = React.useState("");

  const handleChangeD = (event) => {
    setDistrict(event.target.value);
  };

  const handleChangeP = (event) => {
    setProvince(event.target.value);
  };
  const handleChangePO = (event) => {
    setPostNumber(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 220, "& > :not(style)": { m: 1, width: "10ch" } }}>
      <FormControl fullWidth>
        <InputLabel id="district-select-label">District</InputLabel>
        <Select
          labelId="districtselect"
          id="districtselect"
          value={District}
          label="DistrictRole"
          onChange={handleChangeD}
        >
          <MenuItem value={10}>BangSue</MenuItem>
          <MenuItem value={20}>Mueng</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="">Province</InputLabel>
        <Select
          labelId="provinceselect"
          id="provinceselect"
          value={Province}
          label="Province"
          onChange={handleChangeP}
        >
          <MenuItem value={10}>Bangkok</MenuItem>
          <MenuItem value={20}>Nakhonayok</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="">Post Nunber</InputLabel>
        <Select
          labelId="Postnumeselect"
          id="postnumselect"
          value={PostNunber}
          label="PostNumber"
          onChange={handleChangePO}
        >
          <MenuItem value={10}>26000</MenuItem>
          <MenuItem value={20}>11800</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
