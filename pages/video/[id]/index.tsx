import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { CONTENT_SERVICE_URL, VTT_SERVICE_URL } from "../../../env.config";
import {
  Box,
  Button,
  Container,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import ProductAds from "../../../src/components/ProductAds";
import parseMasterPlaylist from "../../../src/utils/parseMaterPlaylist";
import { parseWebVtt } from "../../../src/utils/parseVTTFile";
import Image from "next/image";

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
  const [vttFile, setVttFile] = useState<any>(null);
  const [url, setUrl] = useState("");
  const [playerKey, setPlayerKey] = useState("");
  const [masterPlaylist, setMasterPlaylist] = useState<any>(null);
  const [selectedResolution, setSelectedResolution] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const router = useRouter();
  const [vttData, setVttData] = useState<any>(null);
  const [isVTTSubmited, setIsVTTSubmited] = useState(false);

  const feetchVTTFile = async () => {
    const videoId = router.query.id;
    try {
      const data = await fetch(`${VTT_SERVICE_URL}/api/vtts/${videoId}`);
      const json = await data.json();
      return json;
    } catch (error) {
      console.error("Error fetching the WEBVTT file:", error);
    }
  };

  useEffect(() => {
    const loadVTTFile = async () => {
      const data = await feetchVTTFile();
      setVttFile(VTT_SERVICE_URL + data.vttUrl);
    };
    router.query.id && loadVTTFile();
  });

  const fetchVTTData = async () => {
    try {
      const response = await fetch(vttFile);
      const webvttContent = await response.text();
      const result = parseWebVtt(webvttContent);
      return result;
    } catch (error) {
      console.error("Error fetching or parsing the WEBVTT file:", error);
    }
  };

  useEffect(() => {
    const loadVTTData = async () => {
      const data = await fetchVTTData();
      setVttData(data);
    };
    vttFile && loadVTTData();
  }, [vttFile]);

  const fetchVideoData = async () => {
    const videoId = router.query.id;
    try {
      const response = await fetch(
        `${CONTENT_SERVICE_URL}/api/videos/${videoId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching video data", error);
    }
  };

  useEffect(() => {
    const loadVideoData = async () => {
      const data = await fetchVideoData();
      setVideoData(data);
      setUrl(
        data.transcodeDone
          ? `${CONTENT_SERVICE_URL + data.manifestUrl}`
          : `${CONTENT_SERVICE_URL + data.videoUrl}`
      );
    };
    router.isReady && router.query.id && loadVideoData();
  }, [router.isReady, router.query.id]);

  const fetchMasterPlaylist = async () => {
    try {
      const response = await fetch(url);
      const playlist = await response.text();
      return playlist;
    } catch (error) {
      console.error("Error fetching master playlist:", error);
    }
  };

  useEffect(() => {
    const loadPlaylist = async () => {
      const playlist = await fetchMasterPlaylist();
      setMasterPlaylist(parseMasterPlaylist(playlist));
      setSelectedResolution(parseMasterPlaylist(playlist)[0]);
    };
    url && loadPlaylist();
  }, [url]);

  const handleResolutionChange = (resolution: any) => {
    setSelectedResolution(resolution);
    playerRef.current.getCurrentTime() &&
      setCurrentTime(playerRef.current.getCurrentTime());
  };

  const handleButtonClick = (seconds: number) => {
    playerRef.current?.seekTo(seconds);
  };

  const baseURL = `${CONTENT_SERVICE_URL}/manifest/${videoData?.fileName.replace(
    ".mp4",
    ""
  )}/`;

  const playerURL =
    selectedResolution && selectedResolution.uri
      ? baseURL + selectedResolution.uri
      : url;

  const config = useMemo(() => {
    return {
      file: {
        attributes: {
          crossOrigin: "anonymous",
        },
        tracks: [
          {
            kind: "subtitles",
            src: vttFile,
            default: true,
            mode: "showing",
          },
        ],
      },
    };
  }, [vttFile]);
  console.log("vttData\n", vttData);
  return (
    <Container>
      {videoData ? (
        <>
          <Player
            key={vttFile}
            playing
            url={playerURL}
            playerRef={playerRef}
            onStart={() => playerRef.current?.seekTo(currentTime)}
            config={config}
          />
          <Stack spacing={2} m={8}>
            {vttData &&
              vttData.map((item: any) => {
                return (
                  <ListItemButton
                    key={item.imgURL}
                    sx={{ columnGap: "3rem", border: "1px solid #000" }}
                    onClick={() => handleButtonClick(item.startTime)}
                  >
                    <ListItemIcon>
                      <Image
                        src={item.imgURL}
                        alt={"card-img"}
                        height={250}
                        width={300}
                      />
                    </ListItemIcon>
                    <ListItemText sx={{ rowGap: "1rem" }}>
                      <Typography variant="h5">{item.name}</Typography>
                      <Typography variant="h6">{item.description}</Typography>
                      <Typography variant="h6">{item.price}</Typography>
                      <Typography variant="h6" color={"error"}>
                        play to {item.startTime}
                      </Typography>
                    </ListItemText>
                  </ListItemButton>
                );
              })}
          </Stack>
          <div>
            {masterPlaylist &&
              masterPlaylist.map((item: any) => (
                <button
                  key={item.uri}
                  onClick={() => handleResolutionChange(item)}
                  disabled={item.uri === selectedResolution.uri}
                >
                  {item.resolution}
                </button>
              ))}
          </div>
          <Stack spacing={1} mb={4} mt={4}>
            <Typography variant="h4">{videoData?.title}</Typography>
            <Typography variant="body1">{videoData?.description}</Typography>
          </Stack>
          <Stack>
            <ProductAds
              handleClick={handleButtonClick}
              videoId={router.query.id && router.query.id}
              handleVttFile={setIsVTTSubmited}
              vttProductAds={vttData}
            />
          </Stack>
        </>
      ) : (
        <Typography variant="h5">Not found videoData</Typography>
      )}
    </Container>
  );
}

export default VideoDetailPage;
