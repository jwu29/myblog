import React from 'react';
import CommentItem from './CommentItem';

const mockComments = [
  { id: 1, username: 'whoami', timeAgo: 'Now', text: 'Masters of IT, Cybersecurity Major at UTS' },
  { id: 2, username: 'whoami-2', timeAgo: 'Now', text: 'Passionate in Data Engineering, DevOps and Cloud Security.' },
  { id: 3, username: 'whoami-3', timeAgo: '1 year ago', text: 'Former graduate of Mathematics and Statistics at Imperial College London, UK' }
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