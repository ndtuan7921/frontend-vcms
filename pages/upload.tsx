import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Stack, TextField } from "@mui/material";
import styled from "@emotion/styled";
import Uploader from "../src/components/Uploader";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { useState } from "react";
import { CONTENT_SERVICE_URL } from "../env.config";

const FormfieldWrapper = styled(Box)(({ theme }) => ({
  margin: "8px 0",
}));

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [videoData, setVideoData] = useState({});

  console.log(videoData);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    fetch(`${CONTENT_SERVICE_URL}/api/videos`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        ...videoData,
      }),
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  };
  return (
    <Container maxWidth="lg">
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <Stack
            direction={"row"}
            alignItems="flex-start"
            justifyContent={"space-between"}
          >
            <Stack direction={"column"} sx={{ minWidth: "300px" }}>
              <FormfieldWrapper>
                <TextField
                  id="outlined-basic"
                  label="Title"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  fullWidth
                />
              </FormfieldWrapper>
              <FormfieldWrapper>
                <TextField
                  id="outlined-basic"
                  label="Description"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                />
              </FormfieldWrapper>
            </Stack>

            <Uploader
              handleUpload={setIsVideoUploaded}
              handleVideoData={setVideoData}
            />
          </Stack>

          <FormfieldWrapper>
            <Button
              type="submit"
              variant="contained"
              disabled={!isVideoUploaded}
            >
              Upload
            </Button>
          </FormfieldWrapper>
        </Box>
      </form>
    </Container>
  );
}
