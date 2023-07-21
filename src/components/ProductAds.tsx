import { Button, Stack, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { Uppy } from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import * as webvtt from "node-webvtt";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { UPLOAD_SERVICE_URL, VTT_SERVICE_URL } from "../../env.config";
import convertToSeconds from "../utils/convertToSeconds";
import Image from "next/image";

const uppy = new Uppy({
  debug: true,
  autoProceed: true,
  restrictions: {
    maxNumberOfFiles: 1,
    allowedFileTypes: ["image/*"],
  },
  onBeforeFileAdded: (currentFile, files) => {
    const tick = new Date().getTime();
    const modifiedFile = {
      ...currentFile,
      name:
        currentFile.name.replace(/\s+/g, "").replace(/\.[^/.]+$/, "") +
        "_" +
        tick +
        "." +
        currentFile.extension,
    };
    return modifiedFile;
  },
}).use(Tus, {
  endpoint: UPLOAD_SERVICE_URL + "/upload",
});

function ProductAds(props: any) {
  const { handleClick, videoId, handleVttFile } = props;
  const [productAds, setProductAds] = useState<any>([]);
  const startTimeRef = useRef<HTMLInputElement | null>(null);
  const endTimeRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const desRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);
  const [imgURL, setImgURL] = useState("");

  uppy.on("file-added", (file) => {
    // console.log(file);

    uppy.setMeta({ uploadType: "vtt_image" });

    uppy.setFileMeta(file.id, {
      name: file.name,
    });
  });

  uppy.on("upload-success", function (file, upload) {
    setImgURL(VTT_SERVICE_URL + "/vtt-image/" + file!.name);
  });

  const handleAddNew = () => {
    const startTime = startTimeRef.current!.value;
    const endTime = endTimeRef.current!.value;
    const name = nameRef.current?.value;
    const description = desRef.current?.value;
    const price = priceRef.current?.value;

    if (!startTime || !endTime) return;

    const newProductAds = {
      startTime: convertToSeconds(startTime),
      endTime: convertToSeconds(endTime),
      name: name,
      description: description,
      price: price,
      imgURL: imgURL,
    };
    setProductAds([...productAds, newProductAds]);
    uppy.cancelAll();
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
        text: `${subtitle.name}\n${subtitle.description}\n${subtitle.price}\n${subtitle.imgURL}`,
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
      const response = await fetch(`${VTT_SERVICE_URL}/api/vtts/upload`, {
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
          label="Name"
          required
          variant="outlined"
          fullWidth
          inputRef={nameRef}
        />
        <TextField
          id="outlined-basic"
          label="description"
          variant="outlined"
          fullWidth
          inputRef={desRef}
        />
        <TextField
          id="outlined-basic"
          label="Price"
          required
          variant="outlined"
          fullWidth
          inputRef={priceRef}
        />
        <Dashboard uppy={uppy} proudlyDisplayPoweredByUppy={false} />
        <Button variant="contained" onClick={handleAddNew}>
          Add new
        </Button>
      </Stack>
    </form>
  );
}

export default ProductAds;
