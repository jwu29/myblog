import { useState } from "react";
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import profilePic from "../assets/profile-photo.jpg";

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
            <div className="relative flex items-center justify-center">
              <img
                src={profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover shadow-md top-1/2 left-1/2"
              />
            </div>
            <div>
              <div
                className="inline-block font-semibold relative cursor-pointer after:content-[''] after:absolute after:left-0 after:-bottom-0.5 
              after:h-[1px] after:w-0 after:bg-white hover:after:w-full"
                onClick={() => navigate("/about-me/")}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Josiah Wu
              </div>
              <div className="text-sm text-gray-400">
                Student | IT Enthusiast
              </div>
            </div>
          </div>
          {/*
          <button className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
            Subscribe
          </button>
          */}
        </div>
      </div>
    </div>
  );
}
