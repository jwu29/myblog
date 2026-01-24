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

        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm font-medium text-zinc-300 hover:text-white transition"
          >
            Home
          </Link>
          <Link
            to="/blog"
            className="text-sm font-medium text-zinc-300 hover:text-white transition"
          >
            Blog
          </Link>
          <Link
            to="/about-me"
            className="text-sm font-medium text-zinc-300 hover:text-white transition"
          >
            About Me
          </Link>
        </nav>
      </div>
    </header>
  );
}
