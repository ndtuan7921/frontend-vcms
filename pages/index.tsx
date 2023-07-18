import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { CONTENT_SERVICE_URL } from "../env.config";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import VideoCard, { VideoCardProps } from "../src/components/VideoCard";
import Link from "next/link";

export default function Home() {
  const [videos, setVideos] = useState<VideoCardProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`${CONTENT_SERVICE_URL}/api/videos`);
      const json = await data.json();
      console.log(json);
      setVideos(json);
    };
    fetchData().catch(console.error);
  }, []);
  console.log(videos);
  return (
    <Box
      sx={{
        my: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        ALL UPLOADED VIDEOS
      </Typography>
      <Link href={"/test"}>
        <Typography variant="h4" component="h1" gutterBottom>
          Test
        </Typography>
      </Link>
      {videos.length &&
        videos.map((video) => {
          return (
            <Link
              href={`/video/${video.id}`}
              style={{ width: "90%", textDecoration: "none", color: "inherit" }}
            >
              <VideoCard {...video} />
            </Link>
          );
        })}
    </Box>
  );
}
