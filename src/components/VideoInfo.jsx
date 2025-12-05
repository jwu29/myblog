import { useState } from "react";
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VideoInfo() {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [dislikes, setDislikes] = useState(0);
  const [isDisliked, setIsDisliked] = useState(false);

  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
      setIsDisliked(false);
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setDislikes(dislikes - 1);
      setIsDisliked(false);
    } else {
      setDislikes(likes + 1);
      setIsLiked(false);
      setIsDisliked(true);
    }
  };

  return (
    <div className="w-full mb-4">
      <h1 className="text-2xl font-bold mb-2">Welcome!</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full" />
            <div>
              <div
                className="inline-block font-semibold relative cursor-pointer after:content-[''] after:absolute after:left-0 after:-bottom-0.5 
              after:h-[1px] after:w-0 after:bg-white hover:after:w-full"
                onClick={() => navigate("/about-me/")}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                **Click here for my profile**
              </div>
              <div className="text-sm text-gray-400">1.2mm subscribers</div>
            </div>
          </div>
          {/*
          <button className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
            Subscribe
          </button>
          */}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              isLiked
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            <ThumbsUp
              className="w-5 h-5"
              fill={isLiked ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={handleDislike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              isDisliked
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            <ThumbsDown
              className="w-5 h-5"
              fill={isDisliked ? "currentColor" : "none"}
            />
          </button>
          {/*
          <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full transition">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
          <button className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-full transition">
            <MoreHorizontal className="w-5 h-5" />
          </button>
          */}
        </div>
      </div>
    </div>
  );
}
