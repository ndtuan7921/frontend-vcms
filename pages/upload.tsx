import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Stack, TextField } from "@mui/material";
import styled from "@emotion/styled";
import Uploader from "../src/components/Uploader";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { useRef, useState } from "react";
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
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [videoData, setVideoData] = useState<any>({});

  // Create FormData to send the file
  const formData = new FormData();

  console.log(videoData);

  uppy.on("file-added", (file) => {
    uppy.setMeta({ uploadType: "thumbnail" });
  });

  uppy.on("upload-success", function (file, upload) {
    console.log(file);
    formData.append("thumbnail", file!.data.name);
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;

    if (!title || !description) {
      console.error("Title and description are required");
      return;
    }

    // filename, fileid, thumbnail (file)
    formData.append("fileName", videoData.fileName);
    formData.append("fileId", videoData.fileId);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await fetch(`${CONTENT_SERVICE_URL}/api/videos`, {
        method: "POST",
        headers: {
          // "Access-Control-Allow-Origin": "*",
          "Content-Type": "multipart/form-data",
        },
        // body: JSON.stringify({
        //   title: title,
        //   description: description,
        //   ...videoData,
        // }),
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload video");
      }

      // Reset form values
      // setTitle("");
      // setDescription("");
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
                  // value={title}
                  // onChange={(e) => setTitle(e.target.value)}
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
                  // value={description}
                  // onChange={(e) => setDescription(e.target.value)}
                  inputRef={descriptionRef}
                  fullWidth
                />
              </FormfieldWrapper>
            </Stack>
            <Dashboard uppy={uppy} proudlyDisplayPoweredByUppy={false} />

            <Uploader
              handleUpload={setIsVideoUploaded}
              handleVideoData={setVideoData}
              isSubmitted={isSubmitted}
              setIsSubmitted={setIsSubmitted}
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
