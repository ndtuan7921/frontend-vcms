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
      }
    };
    fetchData().catch(console.error);
  }, []);

  const handleButtonClick = (seconds: number) => {
    playerRef.current?.seekTo(seconds);
  };
  // console.log(videoData);
  const videoUrl = videoData?.transcodeDone
    ? `${CONTENT_SERVICE_URL + videoData.manifestUrl}`
    : null;
  return (
    <Container>
      <Player url={videoUrl} playerRef={playerRef} />
      <Stack spacing={1} mb={4} mt={4}>
        <Typography variant="h4">{videoData?.title}</Typography>
        <Typography variant="body1">{videoData?.description}</Typography>
      </Stack>
      <Stack>
        <ProductAds handleClick={handleButtonClick} />
      </Stack>
    </Container>
  );
}

export default VideoDetailPage;