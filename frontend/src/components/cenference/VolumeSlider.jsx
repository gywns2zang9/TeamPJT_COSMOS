import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

function VolumeSlider() {
  const [value, setValue] = React.useState(30);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 200 }}>
      <Stack spacing={1} direction="row" sx={{ mb: 0 }} alignItems="center">
        <VolumeOffIcon sx={{ fontSize: 30 }} />
        <VolumeUp sx={{ fontSize: 30 }} />
        <Slider aria-label="Volume" value={value} onChange={handleChange} />
      </Stack>
    </Box>
  );
}

export default VolumeSlider;
