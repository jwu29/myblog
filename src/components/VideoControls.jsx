import React from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { formatTime } from "../utils/timeFormat";

export default function VideoControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  handleMouseMove,
}) {
  return (
    <>
      {/* Play overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <button
            onClick={onTogglePlay}
            className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition"
          >
            <Play className="w-10 h-10 ml-2" fill="white" />
          </button>
        </div>
      )}

      {/* Controls */}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
        {/* Progress bar */}
        <div
          className="w-full h-1 bg-gray-600 rounded cursor-pointer mb-2 hover:h-2 transition-all"
          onClick={onSeek}
        >
          <div
            className="h-full bg-blue-600 rounded relative"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full opacity-0 hover:opacity-100" />
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div
            onMouseMove={handleMouseMove}
            className="flex items-center gap-3"
          ></div>
          <div className="flex items-center gap-3 flex-item">
            <button
              onClick={onTogglePlay}
              className="hover:bg-white/20 p-2 rounded"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>

            <div className="flex items-center gap-2 group">
              <button
                onClick={onToggleMute}
                className="hover:bg-white/20 p-2 rounded"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={onVolumeChange}
                className="w-0 group-hover:w-20 transition-all"
              />
            </div>

            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <button
            onClick={onToggleFullscreen}
            className="hover:bg-white/20 p-2 rounded"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}
