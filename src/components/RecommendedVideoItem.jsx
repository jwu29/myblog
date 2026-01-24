import { Play } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function RecommendedVideoItem({ video }) {
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
    <Link
      key={video.id}
      to={`/article/${video.id}`}
      className="group flex-shrink-0"
      style={{ width: "280px" }}
    >
      <div className="flex gap-2 cursor-pointer hover:bg-zinc-900 p-2 rounded-lg transition">
        <div className="relative w-40 h-24 flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg overflow-hidden">
          <div
            className={`relative rounded-lg overflow-hidden aspect-video mb-2 ${
              imgErrors[video.id]
                ? ""
                : "bg-gradient-to-br from-purple-600 to-blue-600" // if thumbnail image returns error, show default thumbnail
            }`}
            style={{
              backgroundColor: imgErrors[video.id] ? undefined : "transparent",
            }}
          />
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
              className="absolute inset-0 w-full h-full object-cover"
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
          <div className="absolute bottom-1 right-1 bg-black/80 px-1 text-xs text-gray-400 rounded">
            {video.duration}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-blue-100 line-clamp-2 mb-1">
            {video.title}
          </h3>
          <p className="text-xs text-gray-400">{video.channel}</p>
          <p className="text-xs text-gray-400">
            {video.views} views • {video.uploaded}
          </p>
        </div>
      </div>
    </Link>
  );
}
