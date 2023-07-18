import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const Player = dynamic(() => import("../src/components/Player"), {
  ssr: false,
});

const baseUrl =
  "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/";

const m3u8URL = baseUrl + ".m3u8";

function test() {
  const [masterPlaylist, setMasterPlaylist] = useState<any>(null);
  const [selectedResolution, setSelectedResolution] = useState<any>(null);
  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetchMasterPlaylist();
  }, []);

  const fetchMasterPlaylist = async () => {
    try {
      const response = await fetch(m3u8URL);
      const playlist = await response.text();
      setMasterPlaylist(parseMasterPlaylist(playlist));
      setSelectedResolution(parseMasterPlaylist(playlist)[0]); // Select the first resolution by default
    } catch (error) {
      console.error("Error fetching master playlist:", error);
    }
  };

  const parseMasterPlaylist = (playlist) => {
    const lines = playlist.split("\n");
    const resolutions: any[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith("#EXT-X-STREAM-INF")) {
        const resolutionMatch = line.match(/RESOLUTION=(\d+x\d+)/);
        const resolution = resolutionMatch ? resolutionMatch[1] : null;

        if (
          resolution &&
          !resolutions.some((item) => item.resolution === resolution)
        ) {
          resolutions.push({ resolution, uri: lines[i + 1] });
        }
      }
    }

    return resolutions;
  };

  const handleResolutionChange = (resolution) => {
    setSelectedResolution(resolution);
    playerRef.current.getCurrentTime() &&
      setCurrentTime(playerRef.current.getCurrentTime());
  };

  console.log({ masterPlaylist, selectedResolution, currentTime });

  return (
    <div>
      <Player
        url={
          selectedResolution !== null
            ? baseUrl + selectedResolution.uri
            : m3u8URL
        }
        playerRef={playerRef}
        controls
        playing
        onStart={() => playerRef.current?.seekTo(currentTime)}
      />
      <div>
        {masterPlaylist &&
          masterPlaylist.map((item) => (
            <button
              key={item.uri}
              onClick={() => handleResolutionChange(item)}
              disabled={item.uri === selectedResolution.uri}
            >
              {item.resolution}
            </button>
          ))}
      </div>
    </div>
  );
}

export default test;
