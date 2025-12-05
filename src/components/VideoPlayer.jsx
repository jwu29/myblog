import { useState, useRef } from "react";
import VideoControls from "./VideoControls";
import RickRoll from "../videos/NGGYU_Final.mp4";

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const isRunning = useRef(false);
  const hasRunOnce = useRef(false);

  const handleMouseMove = () => {
    if (isRunning.current) return;

    isRunning.current = true;

    intervalRef.current = setInterval(() => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }

      // ----- RUN ONLY ONCE -----
      if (!hasRunOnce.current) {
        togglePlay;
        hasRunOnce.current = true; // prevents future runs
      }
      // --------------------------
    }, 250);

    // Stop after 5 seconds
    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      isRunning.current = false;
    }, 3000);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div
      className="bg-black rounded-xl overflow-hidden mb-4"
      onMouseMove={handleMouseMove}
    >
      <div className="w-full h-3/5 relative aspect-video bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full"
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
          width={720}
          height={600}
        >
          <source src={RickRoll} type="video/mp4" />
        </video>

        <VideoControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          onTogglePlay={togglePlay}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onMouseMove={handleMouseMove}
          onToggleMute={toggleMute}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>
    </div>
  );
}
