import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Stack, TextField, Typography } from "@mui/material";
import styled from "@emotion/styled";
import Uploader from "../src/components/Uploader";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { useEffect, useRef, useState } from "react";
import { Uppy, UppyFile } from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import { CONTENT_SERVICE_URL, UPLOAD_SERVICE_URL } from "../env.config";

const FormfieldWrapper = styled(Box)(({ theme }) => ({
  margin: "8px 0",
}));

const TUS_ENDPOINT = "https://tusd.tusdemo.net/files/";

const uppy = new Uppy({
  debug: true,
  autoProceed: true,
  restrictions: {
    maxNumberOfFiles: 1,
    allowedFileTypes: ["image/*"],
  },
}).use(Tus, {
  endpoint: UPLOAD_SERVICE_URL + "/upload",
});

export default function Upload() {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [videoData, setVideoData] = useState<any>({});
  const [thumbnail, setThumbnail] = useState<any>();

  console.log(videoData);

  useEffect(() => {
    if (isSubmitted) {
      uppy.cancelAll();
      setIsSubmitted(false);
    }
  }, [isSubmitted, setIsSubmitted]);

  uppy.on("file-added", (file) => {
    uppy.setMeta({ uploadType: "thumbnail" });
  });

  uppy.on("upload-success", function (file, upload) {
    console.log(file);
    setThumbnail(file!.data.name);
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;

    if (!title || !description) {
      console.error("Title and description are required");
      return;
    }

    try {
      const response = await fetch(`${CONTENT_SERVICE_URL}/api/videos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description,
          ...videoData,
          thumbnail: thumbnail,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload video");
      }

      // Reset form values
      setIsSubmitted((state) => !state);
      titleRef.current!.value = "";
      descriptionRef.current!.value = "";
      setIsVideoUploaded(false);
      setVideoData({});

      alert("Video uploaded successfully!");
    } catch (error) {
      console.error("Error uploading video:", error);
    }
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
            direction={"column"}
            alignItems="flex-start"
            justifyContent={"space-between"}
          >
            <Stack direction={"column"} sx={{ minWidth: "300px" }}>
              <FormfieldWrapper>
                <TextField
                  id="outlined-basic"
                  label="Title"
                  variant="outlined"
                  inputRef={titleRef}
                  required
                  fullWidth
                />
              </FormfieldWrapper>
              <FormfieldWrapper>
                <TextField
                  id="outlined-basic"
                  label="Description"
                  variant="outlined"
                  inputRef={descriptionRef}
                  fullWidth
                />
              </FormfieldWrapper>
            </Stack>
            <Stack spacing={2} direction={"column"}>
              <Uploader
                handleUpload={setIsVideoUploaded}
                handleVideoData={setVideoData}
                isSubmitted={isSubmitted}
                setIsSubmitted={setIsSubmitted}
              />
              {isVideoUploaded && (
                <Stack spacing={1}>
                  <Typography variant="h6">Thumbnail Upload</Typography>
                  <Dashboard uppy={uppy} proudlyDisplayPoweredByUppy={false} />
                </Stack>
              )}
            </Stack>
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
