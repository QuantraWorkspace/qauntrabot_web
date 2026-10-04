"use client";

import { useState, type FormEvent } from "react";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
import type { CommunityPost } from "@/lib/zentra/types";
import { timeAgo } from "@/lib/zentra/format";
import { Sparkline } from "./MarketCard";
import { Chip } from "./ui";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type PostCardProps = {
  post: CommunityPost;
  now?: number;
  /** Author name used for comments written in this session. */
  viewerName: string;
};

/**
 * Likes, saves and comments update in place for the viewer. They are not yet
 * sent anywhere — the community backend is one of the pending integrations.
 */
export default function PostCard({ post, now, viewerName }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [draft, setDraft] = useState("");
  const commentsId = `comments-${post.id}`;

  const addComment = (e: FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setComments((c) => [...c, { author: viewerName, body }]);
    setDraft("");
  };

  return (
    <article className="z-post">
      <header className="flex items-center gap-3">
        <span className="z-avatar" aria-hidden>
          {initials(post.author.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">{post.author.name}</p>
          <p className="z-meta">
            @{post.author.handle} · <time dateTime={post.createdAt.toISOString()}>{timeAgo(post.createdAt, now)}</time>
          </p>
        </div>
        <Chip>{post.topic}</Chip>
      </header>

      {post.thread && <h3 className="z-post-title">{post.thread.title}</h3>}
      <p className="z-post-body">{post.body}</p>

      {post.chart && (
        <figure className="z-post-chart">
          <figcaption className="z-meta">{post.chart.label}</figcaption>
          <Sparkline points={post.chart.points} tone="up" className="h-20" />
        </figure>
      )}

      <footer className="z-post-actions">
        <button type="button" className="z-action" aria-pressed={liked} onClick={() => setLiked((v) => !v)}>
          <Heart size={15} fill={liked ? "currentColor" : "none"} aria-hidden />
          <span>{post.likes + (liked ? 1 : 0)}</span>
          <span className="sr-only">likes</span>
        </button>
        <button
          type="button"
          className="z-action"
          aria-expanded={showComments}
          aria-controls={commentsId}
          onClick={() => setShowComments((v) => !v)}
        >
          <MessageCircle size={15} aria-hidden />
          <span>{comments.length}</span>
          <span className="sr-only">comments</span>
        </button>
        <button type="button" className="z-action ml-auto" aria-pressed={saved} onClick={() => setSaved((v) => !v)}>
          <Bookmark size={15} fill={saved ? "currentColor" : "none"} aria-hidden />
          <span>{saved ? "Saved" : "Save"}</span>
        </button>
      </footer>

      {showComments && (
        <div id={commentsId} className="z-comments">
          {comments.length === 0 && <p className="z-meta">No comments yet.</p>}
          {comments.map((c, i) => (
            <p key={i} className="text-sm leading-relaxed">
              <b className="font-semibold text-foreground">{c.author}</b>{" "}
              <span className="text-muted-foreground">{c.body}</span>
            </p>
          ))}
          <form onSubmit={addComment} className="flex gap-2">
            <label className="sr-only" htmlFor={`${commentsId}-input`}>
              Write a comment
            </label>
            <input
              id={`${commentsId}-input`}
              className="z-input flex-1"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a comment…"
              maxLength={500}
            />
            <button type="submit" className="z-btn z-btn--ghost" disabled={!draft.trim()}>
              Post
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
