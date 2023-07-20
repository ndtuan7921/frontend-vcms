import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { Uppy } from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import * as webvtt from "node-webvtt";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { CONTENT_SERVICE_URL, VTT_SERVICE_URL } from "../../env.config";
import convertToSeconds from "../utils/convertToSeconds";

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
  const { handleClick, videoId, handleVttFile } = props;
  const [productAds, setProductAds] = useState<any>([]);
  const startTimeRef = useRef<HTMLInputElement | null>(null);
  const endTimeRef = useRef<HTMLInputElement | null>(null);
  const textRef = useRef<HTMLInputElement | null>(null);

  const handleAddNew = () => {
    const startTime = startTimeRef.current!.value;
    const endTime = endTimeRef.current!.value;
    const text = textRef.current?.value;

    if (!startTime || !endTime) return;

    const newProductAds = {
      startTime: convertToSeconds(startTime),
      endTime: convertToSeconds(endTime),
      text: text,
    };
    setProductAds([...productAds, newProductAds]);
  };

  function handleSubmit(event: any) {
    event.preventDefault();
  }

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
      parsedSubtitle.cues.push(cue as never);
    });

    const modifiedSubtitleContent = (webvtt as any).compile(parsedSubtitle);

    // const modifiedSubtitleBlob = new Blob([modifiedSubtitleContent], {
    //   type: "text/vtt",
    // });

    const modifiedSubtitleFile = new File(
      [modifiedSubtitleContent],
      "subtitles.vtt"
    );

    // Create FormData to send the file
    const formData = new FormData();
    formData.append("subtitleFile", modifiedSubtitleFile);
    formData.append("videoId", videoId);
    try {
      // Send the FormData to the backend using fetch
      const response = await fetch(`${CONTENT_SERVICE_URL}/api/vtts/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      // Handle the response if needed
      const data = await response.json();
      alert("File uploaded successfully");
      console.log("File uploaded successfully:", data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    try {
      const data = await fetch(`${VTT_SERVICE_URL}/api/vtts/${videoId}`);
      const json = await data.json();
      handleVttFile(VTT_SERVICE_URL + json.vttUrl);
    } catch (error) {
      console.error("Error fetching VTT file:", error);
    }
  };
  return (
    <>
      <Stack spacing={4} mb={4} direction={"row"}>
        {productAds.map((item: any) => {
          return (
            <Button
              key={item.startTime}
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
              // value={startTime}
              // onChange={(e) => setStartTime(e.target.value)}
              required
              fullWidth
              inputRef={startTimeRef}
            />
            <TextField
              id="outlined-basic"
              label="End time"
              variant="outlined"
              required
              fullWidth
              inputRef={endTimeRef}
            />
          </Stack>
          <TextField
            id="outlined-basic"
            label="description"
            variant="outlined"
            fullWidth
            inputRef={textRef}
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
