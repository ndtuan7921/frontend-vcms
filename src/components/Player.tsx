import ReactPlayer, { ReactPlayerProps } from "react-player";

function Player({ url, playerRef, ...props }) {
  return (
    <ReactPlayer url={url} ref={playerRef} {...props} playing={true} controls />
  );
}

export default Player;
