import React, { type FC, useState } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";

import PlayerControls from "@/components/video/PlayerControls";

interface PlayerProps {
  playerRef?: any;
  playerControlsRef?: any;
  playState: boolean;
  url: string;
  title?: string;
  subtitle?: string;
  onNext?: () => void;
  onParentPlay?: () => void;
}

const formatTime = (time: number) => {
  //formarting duration of video
  if (isNaN(time)) {
    return "00:00";
  }

  const date = new Date(time * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  if (hours) {
    //if video has hours
    return `${hours}:${minutes.toString().padStart(2, "0")} `;
  } else return `${minutes}:${seconds}`;
};

let count = 0;

const Player: FC<PlayerProps> = ({
  playState = false,
  playerRef,
  playerControlsRef,
  url,
  title,
  subtitle,
  onNext,
}) => {
  //State for the video player
  const [videoState, setVideoState] = useState({
    playing: playState,
    muted: false,
    volume: 0.5,
    played: 0,
    seeking: false,
    Buffer: true,
  });
  //Destructuring the properties from the videoState
  const { playing, muted, volume, played, seeking } = videoState;
  const currentTime = playerRef?.current
    ? playerRef?.current.getCurrentTime()
    : "00:00";
  const duration = playerRef?.current
    ? playerRef?.current.getDuration()
    : "00:00";
  const formatCurrentTime = formatTime(currentTime);
  const formatDuration = formatTime(duration);
  function playHandler() {
    //Handles Pause/PLay
    setVideoState({
      ...videoState,
      playing: !videoState.playing,
    });
  }
  function rewindHandler() {
    //Rewinds the video player reducing 5
    playerRef?.current?.seekTo(playerRef.current.getCurrentTime() - 5);
  }
  function fastFowardHandler() {
    //FastFowards the video player by adding 10
    playerRef?.current?.seekTo(playerRef.current.getCurrentTime() + 10);
  }
  function progressHandler(state: any) {
    if (count > 2) {
      // toggling player control container

      playerControlsRef.current.style.visibility = "hidden";
    } else if (playerControlsRef.current.style.visibility === "visible") {
      count += 1;
    }
    if (!seeking) {
      setVideoState({ ...videoState, ...state });
    }
  }
  function seekHandler(value: any) {
    setVideoState({ ...videoState, played: parseFloat(value) / 100 });
  }
  function volumeChangeHandler(value: string) {
    const newVolume = parseFloat(value) / 100;
    setVideoState({
      ...videoState,
      volume: newVolume,
      muted: Number(newVolume) === 0 ? true : false, // volume === 0 then muted
    });
  }
  function muteHandler() {
    //Mutes the video player
    setVideoState({ ...videoState, muted: !videoState.muted });
  }
  function mouseMoveHandler() {
    playerControlsRef.current.style.visibility = "visible";
    count = 0;
  }
  const fullscreenHandler = () => {
    if (screenfull.isEnabled) {
      screenfull.request(playerRef.current.wrapper);
    }
  };
  return (
    <div
      className="relative w-full overflow-hidden rounded-md pt-[56.25%] [&>div]:absolute [&>div]:start-0 [&>div]:top-0 [&>div]:!w-full"
      onMouseDown={mouseMoveHandler}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        played={played}
        muted={muted}
        volume={volume}
        onProgress={progressHandler}
      />
      <PlayerControls
        controlRef={playerControlsRef}
        playing={playing}
        played={played}
        onPlayPause={playHandler}
        onRewind={rewindHandler}
        onForward={fastFowardHandler}
        onSeek={(value) => {
          seekHandler(value);
        }}
        volume={volume}
        onVolumeChangeHandler={(value) => {
          volumeChangeHandler(value);
        }}
        mute={muted}
        onMute={muteHandler}
        duration={formatDuration}
        currentTime={formatCurrentTime}
        onFullscreen={fullscreenHandler}
        title={title}
        subtitle={subtitle}
        onNext={() => {
          onNext?.();
        }}
      />
    </div>
  );
};

export default Player;
