import RecommendedVideoItem from "./RecommendedVideoItem";
import ArticlesInfo from "../data/ArticlesInfo.json";
import { memo } from "react";

function RecommendedVideos({ excludeId = "0" }) {
  const articles = ArticlesInfo.articles;

  // Remove the current article from list
  const filtered = articles.filter((a) => a.id !== excludeId).map((a) => a.id);
  console.log(filtered);

  // Shuffle using Fisher-Yates
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);

  // Take first 5 recommended items (or change the number)
  const recommendedIds = shuffled.slice(0, 5);

  // Convert IDs into full article objects
  const recommendedArticles = recommendedIds.map((id) =>
    articles.find((a) => a.id === id)
  );

  return (
    <div className="space-y-3">
      {recommendedArticles.map((article) => (
        <RecommendedVideoItem key={article.id} video={article} />
      ))}
    </div>
  );
}

export default memo(RecommendedVideos);
