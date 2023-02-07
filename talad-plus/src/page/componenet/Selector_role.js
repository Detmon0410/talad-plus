import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect() {
  const [role, setRole] = React.useState("");

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 220 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Role</InputLabel>
        <Select
          labelId="roleselect"
          id="roleselect"
          value={role}
          label="Role"
          onChange={handleChange}
        >
          <MenuItem value={10}>Merchant</MenuItem>
          <MenuItem value={20}>Market Owner</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
