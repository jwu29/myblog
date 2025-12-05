import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Play } from "lucide-react";
import ArticlesInfo from "../data/ArticlesInfo.json";
import PlaylistRow from "./PlaylistRow";

export default function AboutMeArticles() {
  const id = "testing";
  const articles = ArticlesInfo.articles;

  // Get playlists for this channel
  const channelPlaylists = ArticlesInfo.playlists;

  // Get all videos for this channel (not in playlists)
  const allChannelVideos = ArticlesInfo.articles.filter(
    (articles) => articles.channelId === id
  );

  // Get video IDs that are in playlists
  const videosInPlaylists = channelPlaylists.flatMap((p) => p.videos);

  // Get videos NOT in any playlist (standalone videos)
  const standaloneVideos = allChannelVideos.filter(
    (articles) => !videosInPlaylists.includes(articles.id)
  );

  const imageFiles = import.meta.glob(
    "../data/markdown/**/images/*.{png,jpg,jpeg,gif,svg}"
  );

  const [imageMap, setImageMap] = useState({});

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
      })
    ).then((entries) => {
      setImageMap(Object.fromEntries(entries));
    });
  }, []);

  return (
    <div>
      {/* Playlists */}
      {channelPlaylists.length > 0 && (
        <div className="mb-8">
          {channelPlaylists.map((playlist) => (
            <PlaylistRow
              key={playlist.id}
              playlist={playlist}
              videos={ArticlesInfo.articles}
            />
          ))}
        </div>
      )}

      {/* Standalone Videos (not in playlists) */}
      {standaloneVideos.length > 0 && (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">All Uploads</h2>
            <p className="text-gray-400 text-sm">
              {standaloneVideos.length} videos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {standaloneVideos.map((video) => (
              <Link key={video.id} to={`/watch/${video.id}`} className="group">
                <div
                  className={`relative bg-gradient-to-br rounded-lg overflow-hidden aspect-video mb-2`}
                >
                  <img
                    src={
                      imageMap[
                        `${video.markdownFolder}/images/${video.thumbnailImage}`
                      ]
                    }
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:opacity-80 transition"
                  />
                  <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition">
                    <Play className="w-12 h-12 text-white/80" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 text-xs rounded">
                    {video.duration}
                  </div>
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-blue-400 transition">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-400">
                  {video.views} views • {video.uploaded}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Show message if no videos */}
      {channelPlaylists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">
            This channel hasn't uploaded any videos yet.
          </p>
        </div>
      )}
    </div>
  );
}
