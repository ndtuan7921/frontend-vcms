import React, { memo } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";

function Player({ url, playerRef, ...props }) {
  return <ReactPlayer url={url} ref={playerRef} {...props} controls />;
}

export default memo(Player);
