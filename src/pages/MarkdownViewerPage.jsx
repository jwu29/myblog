import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  MoreHorizontal,
  FileText,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import articlesData from "../data/ArticlesInfo.json";
import RecommendedVideos from "../components/RecommendedVideos";
import profilePic from "../assets/profile-photo.jpg";

export default function MarkdownViewerPage() {
  const { id } = useParams();
  const [markdownContent, setMarkdownContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Find the document by ID
  const document = articlesData.articles.find((doc) => doc.id === id);

  const [likes, setLikes] = useState(document?.likes || 0);
  const [dislikes, setDislikes] = useState(document?.dislikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    if (!document) {
      setError("Document not found");
      setLoading(false);
      return;
    }

    const folder = document.markdownFolder;
    const mdfile = document.markdownFile;

    const markdownFiles = import.meta.glob(`../data/markdown/**/content.md`);
    const imageFiles = import.meta.glob(
      "../data/markdown/**/images/*.{png,jpg,jpeg,gif,svg}",
    );
    const [imageMap, setImageMap] = useState({});

    // Preload all image URLs
    Promise.all(
      Object.entries(imageFiles).map(async ([path, resolver]) => {
        const mod = await resolver();
        return [path.replace("../data/markdown/", ""), mod.default];
      }),
    ).then((entries) => {
      setImageMap(Object.fromEntries(entries));
    });

    const path = `../data/markdown/${folder}/content.md`;

    console.log("Looking for:", path);
    console.log("Available MD files:", Object.keys(markdownFiles));
    console.log(markdownFiles);
    console.log(path);

    if (!markdownFiles[path]) {
      setError("Markdown file not found");
      setLoading(false);
      return;
    }

    setLoading(true);

    markdownFiles[path]()
      .then((mod) => fetch(mod.default))
      .then((res) => res.text())
      .then((text) => {
        setMarkdownContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load document");
        setLoading(false);
      });
  }, [document]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto p-4">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Paranoid Android</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link to="/" className="text-blue-400 hover:text-blue-300">
              Return to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  // Get related documents (exclude current one)
  const relatedDocuments = articlesData.articles
    .filter((doc) => doc.id !== id)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Main content */}
          <div className="flex-1">
            {/* Document "Thumbnail" */}
            <div className="relative w-full min-h-[300px] rounded-xl overflow-hidden mb-4 flex items-center justify-center">
              <img
                src={imageMap[`${id}/images/${document.thumbnailImage}`]}
                alt="Document thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            {/* Document Info */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-2">{document.title}</h1>
              <div className="flex items-center justify-between flex-wrap gap-4">
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
                        50K subscribers
                      </div>
                    </div>
                  </div>
                  <button className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
                    Subscribe
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
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

            {/* Description */}
            <div className="bg-zinc-900 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-4 mb-2 text-sm">
                <span className="font-semibold">{document.views} views</span>
                <span className="text-gray-400">{document.uploaded}</span>
              </div>
              <p className="text-gray-300">{document.description}</p>
            </div>

            <div className="bg-zinc-900 rounded-xl p-8 mb-4 max-w-7xl">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading document...</p>
                </div>
              ) : (
                <div className="markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Custom image component to handle relative paths
                      img: ({ node, ...props }) => {
                        let src = props.src;

                        // If image path is relative (starts with ./), resolve it
                        if (src && src.startsWith("./")) {
                          const relativePath = `${
                            document.markdownFolder
                          }/${src.replace("./", "")}`;
                          if (imageMap[relativePath]) {
                            src = imageMap[relativePath];
                          } else {
                            console.warn(
                              "Image not found in imageMap:",
                              relativePath,
                            );
                          }
                        }

                        return (
                          <img
                            {...props}
                            src={src}
                            alt={props.alt || "Image"}
                            loading="lazy"
                          />
                        );
                      },
                    }}
                  >
                    {markdownContent}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
          {/* Related Articles Sidebar */}
          <div className="lg:w-96">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold mb-4">
                Recommended Articles
              </h2>
              <RecommendedVideos excludeId={document.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
