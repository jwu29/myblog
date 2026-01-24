import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Play } from "lucide-react";
import ArticlesInfo from "../data/ArticlesInfo.json";
import Articles from "../components/AboutMeHome";

export default function Blog() {
  const videos = ArticlesInfo.articles;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Blog Articles</h1>
        <div className="mt-10 px-4">
          <Articles />
        </div>
      </div>
    </div>
  );
}
