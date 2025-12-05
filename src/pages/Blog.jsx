import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Play } from "lucide-react";
import ArticlesInfo from "../data/ArticlesInfo.json";

export default function Blog() {
  const videos = ArticlesInfo.articles;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Recommended</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => (
            <Link key={video.id} to={`/watch/${video.id}`} className="group">
              <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg overflow-hidden aspect-video mb-2">
                <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition">
                  <Play className="w-12 h-12 text-white/80" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 text-xs rounded">
                  {video.duration}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-purple-500 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-blue-400 transition">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-400">{video.channel}</p>
                  <p className="text-xs text-gray-400">
                    {video.views} views • {video.uploaded}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
