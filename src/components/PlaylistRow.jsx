import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, ChevronRight } from "lucide-react";

function PlaylistRow({ playlist, videos }) {
  // Get videos that belong to this playlist
  const playlistVideos = videos.filter((video) =>
    playlist.videos.includes(video.id),
  );

  const imageFiles = import.meta.glob(
    "../data/markdown/**/images/*.{png,jpg,jpeg,gif,svg}",
  );

  const [imageMap, setImageMap] = useState({});
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    Promise.all(
      Object.entries(imageFiles).map(async ([filepath, resolver]) => {
        const mod = await resolver();

        // Converts:
        // "../data/markdown/sample-document/images/aws.png"
        // to:
        // "sample-document/images/aws.png"
        const cleanPath = filepath.replace("../data/markdown/", "");

        return [cleanPath, mod.default];
      }),
    ).then((entries) => {
      setImageMap(Object.fromEntries(entries));
    });
  }, []);

  return (
    <div className="mb-8">
      {/* Playlist Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">{playlist.name}</h2>
          <span className="text-sm text-gray-400">
            {playlist.videos.length} articles
          </span>
        </div>
        {/*
        <Link
          to={`/playlist/${playlist.id}`}
          className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </Link>
        */}
      </div>

      {/* Videos in horizontal scroll */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4" style={{ minWidth: "min-content" }}>
          {playlistVideos.map((video) => (
            <Link
              key={video.id}
              to={`/article/${video.id}`}
              className="group flex-shrink-0"
              style={{ width: "280px" }}
            >
              <div
                className={`relative rounded-lg overflow-hidden aspect-video mb-2 ${
                  imgErrors[video.id]
                    ? ""
                    : "bg-gradient-to-br from-purple-600 to-blue-600" // if thumbnail image returns error, show default thumbnail
                }`}
                style={{
                  backgroundColor: imgErrors[video.id]
                    ? undefined
                    : "transparent",
                }}
              >
                {!imgErrors[video.id] &&
                imageMap[
                  `${video.markdownFolder}/images/${video.thumbnailImage}` // check thumbnail image exists
                ] ? (
                  <img
                    src={
                      imageMap[
                        `${video.markdownFolder}/images/${video.thumbnailImage}`
                      ]
                    }
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:opacity-80 transition"
                    onError={() =>
                      setImgErrors((prev) => ({ ...prev, [video.id]: true }))
                    }
                  />
                ) : null}

                <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition">
                  <Play
                    className="w-12 h-12"
                    style={{
                      filter: "invert(1) grayscale(0.9)", // tries to invert color
                      mixBlendMode: "difference",
                    }}
                  />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 text-xs text-white rounded">
                  {video.duration}
                </div>
              </div>
              <h3 className="font-semibold text-sm text-blue-200 line-clamp-2 mb-1 group-hover:text-blue-400 transition">
                {video.title}
              </h3>
              <p className="text-xs text-gray-400">{video.channel}</p>
              <p className="text-xs text-gray-400">{video.uploaded}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlaylistRow;
