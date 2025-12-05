import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-800 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold text-white">
              Josiah Wu's Blog
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <button className="hover:bg-zinc-800 p-2 rounded-full transition">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <Link to="/about-me">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full cursor-pointer" />
          </Link>
        </div>
      </div>
    </header>
  );
}
