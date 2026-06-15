"use client";

import { useState } from "react";
import "./NestedComments.css";

const INITIAL_COMMENTS = [
  {
    id: 1,
    author: "Alice",
    text: "Great article! Really helped me understand recursion.",
    replies: [
      {
        id: 2,
        author: "Bob",
        text: "Same here — the examples were clear.",
        replies: [
          {
            id: 3,
            author: "Alice",
            text: "Glad it helped!",
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    author: "Charlie",
    text: "Can someone explain the time complexity?",
    replies: [],
  },
];

function createCommentId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function addReplyToTree(comments, parentId, newComment) {
  return comments.map((comment) => {
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: [...(comment.replies ?? []), newComment],
      };
    }

    if (comment.replies?.length) {
      return {
        ...comment,
        replies: addReplyToTree(comment.replies, parentId, newComment),
      };
    }

    return comment;
  });
}

function CommentItem({ comment, depth = 0, onReply }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const replyCount = comment.replies?.length ?? 0;

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    onReply(comment.id, replyText.trim());
    setReplyText("");
    setShowReplyForm(false);
    setCollapsed(false);
  };

  return (
    <article className="comment" style={{ marginLeft: depth * 20 }}>
      <header className="comment__header">
        <strong className="comment__author">{comment.author}</strong>
        {replyCount > 0 && (
          <button
            type="button"
            className="comment__collapse"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {collapsed ? `Show ${replyCount} replies` : "Collapse"}
          </button>
        )}
      </header>

      <p className="comment__text">{comment.text}</p>

      <button
        type="button"
        className="comment__reply-btn"
        onClick={() => setShowReplyForm((prev) => !prev)}
      >
        Reply
      </button>

      {showReplyForm && (
        <form className="comment__form" onSubmit={handleSubmitReply}>
          <input
            className="comment__input"
            placeholder="Write a reply…"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button type="submit" className="comment__submit">
            Post
          </button>
        </form>
      )}

      {!collapsed && replyCount > 0 && (
        <div className="comment__replies">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </article>
  );
}

export default function NestedComments() {
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [rootText, setRootText] = useState("");

  const handleReply = (parentId, text) => {
    const newComment = {
      id: createCommentId(),
      author: "You",
      text,
      replies: [],
    };
    setComments((prev) => addReplyToTree(prev, parentId, newComment));
  };

  const handleRootComment = (e) => {
    e.preventDefault();
    if (!rootText.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: createCommentId(),
        author: "You",
        text: rootText.trim(),
        replies: [],
      },
    ]);
    setRootText("");
  };

  return (
    <div className="nested-comments">
      <header className="nested-comments__header">
        <h2 className="nested-comments__title">Nested Comments</h2>
        <p className="nested-comments__subtitle">
          Reply to any comment with infinite nesting — expand or collapse
          threads.
        </p>
      </header>

      <form className="nested-comments__form" onSubmit={handleRootComment}>
        <input
          className="nested-comments__input"
          placeholder="Add a comment…"
          value={rootText}
          onChange={(e) => setRootText(e.target.value)}
        />
        <button type="submit" className="nested-comments__submit">
          Comment
        </button>
      </form>

      <div className="nested-comments__list">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
          />
        ))}
      </div>
    </div>
  );
}
