import React from "react";
import profilePic from "../assets/profile-photo.jpg";

export default function VideoDescription() {
  return (
    <div className="w-full bg-zinc-900 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-4 mb-2 text-sm">
        <span className="font-semibold">Last edit on Jan 24, 2026</span>
      </div>
      <p className="text-gray-300">We're no strangers to IT.</p>
      <p className="text-gray-300">You know the rules, and so do I.</p>
      <p className="text-gray-300">
        A load of articles is what I am thinking of.
      </p>
      <p className="text-gray-300">
        You wouldn't get this blog from any other guy.
      </p>
      <p className="text-gray-300">Welcome to my blog!</p>
    </div>
  );
}
