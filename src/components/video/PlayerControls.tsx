import React, { type FC } from "react";
import { Icon } from "@iconify/react";
import RangeSlider from "@/components/elements/addons/range-slider/RangeSlider";

interface PlayerControlsProps {
  controlRef?: any;
  playing: boolean;
  played: number;
  volume: number;
  mute?: boolean;
  currentTime: string;
  duration: string;
  title?: string;
  subtitle?: string;
  onPlayPause?: () => void;
  onRewind?: () => void;
  onForward?: () => void;
  onSeek?: (value: number) => void;
  onVolumeChangeHandler?: (value: string) => void;
  onMute?: () => void;
  onNext?: () => void;
  onFullscreen?: () => void;
}

const PlayerControls: FC<PlayerControlsProps> = ({
  onPlayPause,
  onRewind,
  onForward,
  onSeek,
  onVolumeChangeHandler,
  onMute,
  onNext,
  onFullscreen,
  title,
  subtitle,
  controlRef,
  playing = false,
  played,
  volume,
  mute,
  currentTime,
  duration,
}) => {
  return (
    <div
      ref={controlRef}
      className="group/react-slider absolute inset-0 z-[1] flex flex-col justify-between bg-muted-900/60"
    >
      <div className="hidden md:flex items-center justify-between px-8 py-6">
        <div>
          <p className="text-sm uppercase text-white/80">{subtitle}</p>
          <h2 className="text-xl font-medium tracking-wide text-white">
            {title}
          </h2>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 pt-10 md:pt-0 ptablet:relative ptablet:-top-8 ltablet:relative ltablet:-top-8 lg:relative lg:-top-8">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-muted-100 hover:text-muted-600 dark:hover:bg-muted-800 dark:hover:text-muted-100"
          onDoubleClick={() => {
            onRewind?.();
          }}
        >
          <Icon icon="ri:replay-5-fill" className="h-6 w-6" />
        </button>

        <button
          type="button"
          className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full border-2 border-white text-white transition-colors duration-300 hover:border-danger-600 hover:bg-danger-600"
          onClick={() => {
            onPlayPause?.();
          }}
        >
          {playing ? (
            <Icon
              icon="iconamoon:player-pause-fill"
              className="pointer-events-none h-5 w-5 md:h-6 md:w-6"
            />
          ) : (
            <Icon
              icon="iconamoon:player-play-fill"
              className="pointer-events-none h-5 w-5 md:h-6 md:w-6"
            />
          )}
        </button>

        <div className="relative">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-muted-100 hover:text-muted-600 dark:hover:bg-muted-800 dark:hover:text-muted-100"
            onDoubleClick={() => {
              onForward?.();
            }}
          >
            <Icon icon="ri:forward-5-fill" className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="relative">
        <div className="flex scale-95 items-center px-4">
          <RangeSlider
            color="danger"
            tooltip={false}
            handleHover
            value={played * 100}
            onSliderChange={(value) => {
              onSeek?.(value);
            }}
          />
        </div>
        <div className="flex items-center justify-between px-4 md:px-8 pb-2 pt-3">
          <div className="flex w-full items-center gap-1 py-2">
            <div className="relative">
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-muted-100 hover:text-muted-600 dark:border-muted-800 dark:hover:bg-muted-800 dark:hover:text-muted-100"
                onClick={() => {
                  onPlayPause?.();
                }}
              >
                {playing ? (
                  <Icon
                    icon="iconamoon:player-pause-fill"
                    className="pointer-events-none h-4 w-4"
                  />
                ) : (
                  <Icon
                    icon="iconamoon:player-play-fill"
                    className="pointer-events-none h-4 w-4"
                  />
                )}
              </button>
            </div>
            <div className="relative">
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-muted-100 hover:text-muted-600 dark:hover:bg-muted-800 dark:hover:text-muted-100"
                onClick={() => {
                  onNext?.();
                }}
              >
                <Icon icon="iconamoon:player-end-fill" className="h-4 w-4" />
              </button>
            </div>
            <div className="relative">
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-muted-100 hover:text-muted-600 dark:hover:bg-muted-800 dark:hover:text-muted-100"
                onClick={onMute}
              >
                {mute ? (
                  <Icon icon="ic:baseline-volume-off" className="h-4 w-4" />
                ) : (
                  <Icon icon="ic:baseline-volume-up" className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative -top-0.5 -ms-3 w-24 scale-75">
                <RangeSlider
                  color="danger"
                  value={volume * 100}
                  onSliderChange={(value) => {
                    onVolumeChangeHandler?.(value.toString());
                  }}
                />
              </div>
              <span className="text-xs text-white">
                <span>
                  {currentTime} : {duration}
                </span>
              </span>
            </div>

            <div className="relative ms-auto">
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-muted-100 hover:text-muted-600 dark:hover:bg-muted-800 dark:hover:text-muted-100"
                onClick={() => {
                  onFullscreen?.();
                }}
              >
                <Icon icon="mingcute:fullscreen-fill" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
