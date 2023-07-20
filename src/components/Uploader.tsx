import { Uppy, UppyFile } from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { UPLOAD_SERVICE_URL } from "../../env.config";
import { Stack, Typography } from "@mui/material";

const TUS_ENDPOINT = "https://tusd.tusdemo.net/files/";

const uppy = new Uppy({
  debug: true,
  autoProceed: true,
  restrictions: {
    maxNumberOfFiles: 1,
    allowedFileTypes: ["video/*"],
  },
  onBeforeFileAdded: (currentFile, files) => {
    const Tick = new Date().getTime();
    const modifiedFile = {
      ...currentFile,
      name:
        currentFile.name.replace(".mp4", "").replace(/\s/g, "_") +
        "_" +
        Tick +
        ".mp4",
    };
    return modifiedFile;
  },
}).use(Tus, {
  endpoint: UPLOAD_SERVICE_URL + "/upload",
});

interface UploaderProps {
  handleUpload: Dispatch<SetStateAction<boolean>>;
  handleVideoData: Dispatch<SetStateAction<object>>;
  isSubmitted: boolean;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
}

function Uploader(props: UploaderProps) {
  const { handleUpload, handleVideoData, isSubmitted, setIsSubmitted } = props;

  useEffect(() => {
    if (isSubmitted) {
      uppy.cancelAll();
      setIsSubmitted(false);
    }
  }, [isSubmitted, setIsSubmitted]);

  uppy.on("file-added", (file) => {
    uppy.setMeta({ uploadType: "video" });

    uppy.setFileMeta(file.id, {
      name: file.name,
    });
  });

  uppy.on("complete", ({ successful, failed }) => {
    console.log("successful\t", successful);
    console.log("failed\t", failed);
  });

  uppy.on("upload-success", function (file, upload) {
    handleUpload(true);
    console.log(file);
    handleVideoData({ fileName: file!.name, fileId: file!.id });
  });

  uppy.on("file-removed", (file, reason) => {
    handleUpload(false);
  });

  return (
    <Stack spacing={1}>
      <Typography variant="h6">Video Upload</Typography>
      <Dashboard uppy={uppy} proudlyDisplayPoweredByUppy={false} />
    </Stack>
  );
}

export default Uploader;
