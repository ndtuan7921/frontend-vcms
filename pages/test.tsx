import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";

const Player = dynamic(() => import("../src/components/Player"), {
  ssr: false,
});
const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

// function test() {
//   const [selectedResolution, setSelectedResolution] = useState<string | null>(
//     null
//   );
//   const [resolutions, setResolutions] = useState<any>([]);
//   const playerRef = useRef<ReactPlayer | null>(null);

//   useEffect(() => {
//     const fetchM3u8Data = async () => {
//       try {
//         const response = await fetch(
//           "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
//         );
//         const m3u8Content = await response.text();
//         const resolutionData = parseResolutionData(m3u8Content);
//         setResolutions(resolutionData);
//       } catch (error) {
//         console.error("Error fetching m3u8 data:", error);
//       }
//     };

//     fetchM3u8Data();
//   }, []);

//   const parseResolutionData = (m3u8Content: string) => {
//     const resolutionRegex = /RESOLUTION=(\d+x\d+)/g;
//     const matches = m3u8Content.match(resolutionRegex);

//     if (matches) {
//       return matches.map((match) => {
//         const resolution = match.split("=")[1];
//         return {
//           label: resolution,
//           value: resolution,
//         };
//       });
//     }

//     return [];
//   };

//   const handlePlayerReady = () => {
//     if (playerRef.current) {
//       playerRef.current.seekTo(0); // Reset player to the beginning
//     }
//   };

//   const handleResolutionChange = (resolution: string) => {
//     setSelectedResolution(resolution);
//   };

//   const renderResolutionOptions = () => {
//     return resolutions.map((resolution, index) => (
//       <option key={index} value={resolution.value}>
//         {resolution.label}
//       </option>
//     ));
//   };

//   console.log(resolutions);

//   const hlsConfig = {
//     level: {
//       manual: {
//         level: selectedResolution,
//       },
//     },
//   };
//   const onChangeBitrate = (event) => {
//     const internalPlayer = playerRef.current?.getInternalPlayer("hls");
//     if (internalPlayer) {
//       // currentLevel expect to receive an index of the levels array
//       internalPlayer.currentLevel = event.target.value;
//     }
//   };
//   return (
//     <div>
//       <select
//         value={selectedResolution || ""}
//         onChange={(e) => handleResolutionChange(e.target.value)}
//       >
//         <option value="">Select Resolution</option>
//         {renderResolutionOptions()}
//       </select>
//       Quality:
//       <select onChange={onChangeBitrate}>
//         {playerRef.current
//           ?.getInternalPlayer("hls")
//           ?.levels.map((level, id) => (
//             <option key={id} value={id}>
//               {level.bitrate}
//             </option>
//           ))}
//       </select>
//       <Player
//         url="https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/playlist_360p.m3u8"
//         playerRef={playerRef}
//         width="100%"
//         height="auto"
//         config={{
//           file: {
//             attributes: {
//               crossOrigin: "true",
//               controlsList: "nodownload",
//               type: "application/x-mpegURL",
//             },
//           },
//           hlsjsConfig: hlsConfig,
//         }}
//         onReady={handlePlayerReady}
//       />
//     </div>
//   );
// }

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
      const response = await fetch(
        "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"
      );
      const playlist = await response.text();
      setMasterPlaylist(parseMasterPlaylist(playlist));
      setSelectedResolution(parseMasterPlaylist(playlist)[0].resolution); // Select the first resolution by default
    } catch (error) {
      console.error("Error fetching master playlist:", error);
    }
  };

  const parseMasterPlaylist = (playlist) => {
    const lines = playlist.split("\n");
    const resolutions = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith("#EXT-X-STREAM-INF")) {
        const resolutionMatch = line.match(/RESOLUTION=(\d+x\d+)/);
        const resolution = resolutionMatch ? resolutionMatch[1] : "Unknown";
        resolutions.push({ resolution, uri: lines[i + 1] });
      }
    }

    return resolutions;
  };

  const handleResolutionChange = (resolution) => {
    setSelectedResolution(resolution);
    setCurrentTime(playerRef.current?.getCurrentTime());
  };

  console.log("currentTime\n", currentTime);
  const baseUrl =
    "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/";

  return (
    <div>
      <Player
        url={selectedResolution ? baseUrl + selectedResolution.uri : ""}
        playerRef={playerRef}
        controls
        // playing
        onReady={() => playerRef.current?.seekTo(Math.round(currentTime))}
        // onReady={() => playerRef.current?.seekTo(30)}
      />
      <div>
        {masterPlaylist &&
          masterPlaylist.map((item, index) => (
            <button
              key={index}
              onClick={() => handleResolutionChange(item)}
              disabled={item === selectedResolution}
            >
              {item.resolution}
            </button>
          ))}
      </div>
    </div>
  );
}

export default test;
