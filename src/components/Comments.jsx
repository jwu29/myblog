import React from "react";
import CommentItem from "./CommentItem";

const mockComments = [
  {
    id: 1,
    username: "Pick Ashley",
    timeAgo: "2 years ago",
    text: "More information can be found here! https://www.youtube.com/watch?v=XGxIE1hr0w4",
  },
];

export default function Comments() {
  return (
    <div className="w-full border-t border-zinc-800 pt-4">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      <div className="space-y-4">
        {mockComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
