import React from "react";

export default function VideoDescription() {
  return (
    <div className="w-full bg-zinc-900 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-4 mb-2 text-sm">
        <span className="font-semibold">1,234,567 views</span>
        <span className="text-gray-400">Jan 15, 2024</span>
      </div>
      <p className="text-gray-300">
        We're no strangers to rickrolls. Welcome to my blog! Visit my channel
        page for my articles.
      </p>
    </div>
  );
}
