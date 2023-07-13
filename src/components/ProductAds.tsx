import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { Uppy } from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
// import WebVTT from "node-webvtt";
import * as webvtt from "node-webvtt";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

const uppy = new Uppy({
  debug: true,
  autoProceed: true,
  restrictions: {
    maxNumberOfFiles: 1,
    allowedFileTypes: ["image/*"],
  },
}).use(Tus, {
  endpoint: "",
});

function ProductAds(props: any) {
  const { handleClick } = props;
  const [productAds, setProductAds] = useState<any>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [text, setText] = useState("");

  const convertToSeconds = (timeString: string) => {
    const timeParts = timeString.split(":");
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const secs = parseInt(timeParts[2], 10);

    return hours * 3600 + minutes * 60 + secs;
  };

  const handleAddNew = () => {
    const newProductAds = {
      startTime: convertToSeconds(startTime),
      endTime: convertToSeconds(endTime),
      text: text,
    };
    setProductAds([...productAds, newProductAds]);
  };

  function handleSubmit(event: any) {
    event.preventDefault();
    // console.log({ startTime, endTime, text });
  }
  console.log(productAds);

  const handleGenerateSubtitleFile = async () => {
    const parsedSubtitle = {
      cues: [],
      valid: true,
    };

    productAds.forEach((subtitle: any, index: any) => {
      const cue = {
        identifier: (index + 1).toString(),
        start: subtitle.startTime,
        end: subtitle.endTime,
        text: subtitle.text,
        styles: "",
      };
      parsedSubtitle.cues.push(cue);
    });

    const modifiedSubtitleContent = (webvtt as any).compile(parsedSubtitle);
    const modifiedSubtitleBlob = new Blob([modifiedSubtitleContent], {
      type: "text/vtt",
    });
    const downloadLink = URL.createObjectURL(modifiedSubtitleBlob);
    const a = document.createElement("a");
    a.href = downloadLink;
    a.download = "subtitles.vtt";
    a.click();

    // Create FormData to send the file
    const formData = new FormData();
    formData.append("subtitleFile", modifiedSubtitleBlob, "subtitles.vtt");
    try {
      // Send the FormData to the backend using fetch
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "text/vtt",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      // Handle the response if needed
      const data = await response.json();
      console.log("File uploaded successfully:", data);
    } catch (error) {
      // Handle any error that occurred during the upload
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <Stack spacing={4} mb={4} direction={"row"}>
        {productAds.map((item: any) => {
          return (
            <Button
              onClick={() => handleClick(item.startTime)}
              variant="outlined"
            >
              play to {item.startTime}
            </Button>
          );
        })}
      </Stack>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} direction={"row"} mb={4}>
          <Typography variant="h4">Insert Product Ads</Typography>
          <Button onClick={handleGenerateSubtitleFile} variant="contained">
            Submit .vtt file
          </Button>
        </Stack>

        <Stack spacing={2} direction={"column"}>
          <Stack spacing={2} direction={"row"}>
            <TextField
              id="outlined-basic"
              label="Start time"
              variant="outlined"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              fullWidth
            />
            <TextField
              id="outlined-basic"
              label="End time"
              variant="outlined"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              fullWidth
            />
          </Stack>
          {/* <Stack spacing={2} direction={"row"}>
            <Dashboard
              uppy={uppy}
              //   hideUploadButton
              proudlyDisplayPoweredByUppy={false}
              width={400}
              height={100}
            />
          </Stack> */}
          <TextField
            id="outlined-basic"
            label="description"
            variant="outlined"
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddNew}>
            Add new
          </Button>
        </Stack>
      </form>
    </>
  );
}

export default ProductAds;
