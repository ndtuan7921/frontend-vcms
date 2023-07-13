import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";
import { SyntheticEvent, useState } from "react";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Header() {
  const [value, setValue] = useState("one");

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs onChange={handleChange}>
          <Link href="/">
            <Tab value={0} label="All Videos" {...a11yProps(0)} />
          </Link>
          <Link href="/upload">
            <Tab value={1} label="Upload" {...a11yProps(1)} />
          </Link>
        </Tabs>
      </Box>
    </Box>
  );
}
