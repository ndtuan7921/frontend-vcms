import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { CONTENT_SERVICE_URL } from "../../../env.config";
import { Container, Stack, Typography } from "@mui/material";
import ProductAds from "../../../src/components/ProductAds";
const Player = dynamic(() => import("../../../src/components/Player"), {
  ssr: false,
});

interface VideoDataProps {
  id: string;
  fileName: string;
  filedId: string;
  title: string;
  description: string;
  videoUrl: string;
  manifestUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  transcodeDone: boolean;
}

function VideoDetailPage() {
  const playerRef = useRef<any>();
  const [videoData, setVideoData] = useState<VideoDataProps>();
  const [url, setUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (router.query.id) {
        const videoId = router.query.id;
        const data = await fetch(
          `${CONTENT_SERVICE_URL}/api/videos/${videoId}`
        );
        const json = await data.json();
        console.log(json);
        setVideoData(json);
        setUrl(
          json.transcodeDone
            ? `${CONTENT_SERVICE_URL + json.manifestUrl}`
            : `${CONTENT_SERVICE_URL + json.videoUrl}`
        );
      }
    };
    if (router.isReady) {
      fetchData().catch(console.error);
    }
  }, [router]);

  const handleButtonClick = (seconds: number) => {
    playerRef.current?.seekTo(seconds);
  };
  // console.log(videoData);

  console.log(url);
  return (
    <Container>
      {videoData ? (
        <>
          <Player url={url} playerRef={playerRef} />
          <Stack spacing={1} mb={4} mt={4}>
            <Typography variant="h4">{videoData?.title}</Typography>
            <Typography variant="body1">{videoData?.description}</Typography>
          </Stack>
          <Stack>
            <ProductAds handleClick={handleButtonClick} />
          </Stack>
        </>
      ) : (
        <Typography variant="h5">Not found videoData</Typography>
      )}
    </Container>
  );
}

export default VideoDetailPage;
