const parseMasterPlaylist = (playlist: any) => {
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

export default parseMasterPlaylist;
