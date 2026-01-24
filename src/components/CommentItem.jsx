import React from 'react';

export default function CommentItem({ comment }) {
  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold">@{comment.username}</span>
          <span className="text-sm text-gray-400">{comment.timeAgo}</span>
        </div>
        <p className="text-gray-300">
          {comment.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
            /^https?:\/\//.test(part) ? (
              <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                {part}
              </a>
            ) : (
              part
            )
          )}
        </p>
      </div>
    </div>
  );
}
