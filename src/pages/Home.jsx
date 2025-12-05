import React from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import VideoInfo from "../components/VideoInfo";
import VideoDescription from "../components/VideoDescription";
import Comments from "../components/Comments";
import RecommendedVideos from "../components/RecommendedVideos";
import Navbar from "../components/NavBar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="flex-1">
            <VideoPlayer />
            <VideoInfo />
            <VideoDescription />
            <Comments />
          </div>
          <div className="lg:w-96">
            <h2 className="text-lg font-semibold mb-4">Recommended Articles</h2>
            <RecommendedVideos />
          </div>
        </div>
      </div>
    </div>
  );
}
