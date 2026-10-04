"use client";

import { useState } from "react";
import { MessageCircle, MessagesSquare } from "lucide-react";
import { getCommunityFeed, getDiscussions } from "@/lib/zentra/data";
import { useResource } from "@/lib/zentra/useResource";
import { useMemberName, useNow } from "@/lib/zentra/hooks";
import { timeAgo } from "@/lib/zentra/format";
import type { CommunityPost } from "@/lib/zentra/types";
import { Chip, EmptyState, PageTitle, ResourceBody, SampleTag, Skeleton } from "@/components/dashboard/zentra/ui";
import PostCard from "@/components/dashboard/zentra/PostCard";
import FilterTabs from "@/components/dashboard/zentra/FilterTabs";

type Topic = "ALL" | CommunityPost["topic"];
const TOPICS: { value: Topic; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "Setups", label: "Setups" },
  { value: "Macro", label: "Macro" },
  { value: "Education", label: "Education" },
  { value: "Psychology", label: "Psychology" },
];

export function CommunityFeedView() {
  const now = useNow();
  const name = useMemberName();
  const feed = useResource(getCommunityFeed);
  const [topic, setTopic] = useState<Topic>("ALL");

  return (
    <div className="z-page z-page--narrow">
      <PageTitle
        title="Community Feed"
        lede="Setups, market reads and lessons learned from other members."
        aside={feed.source === "sample" ? <SampleTag /> : undefined}
      />
      <FilterTabs label="Topic" options={TOPICS} value={topic} onChange={setTopic} />
      <ResourceBody
        resource={feed}
        isEmpty={(d) => d.length === 0}
        loading={<Skeleton rows={3} height="12rem" />}
        empty={<EmptyState icon={MessagesSquare} title="It's quiet in here" body="Posts from other members will show up here." />}
      >
        {(posts) => {
          const list = posts.filter((p) => topic === "ALL" || p.topic === topic);
          return list.length === 0 ? (
            <EmptyState icon={MessagesSquare} title="No posts on this topic yet" body="Try another topic." />
          ) : (
            <div className="flex flex-col gap-3">
              {list.map((p) => (
                <PostCard key={p.id} post={p} now={now} viewerName={name} />
              ))}
            </div>
          );
        }}
      </ResourceBody>
    </div>
  );
}

export function DiscussionsView() {
  const now = useNow();
  const name = useMemberName();
  const threads = useResource(getDiscussions);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="z-page z-page--narrow">
      <PageTitle
        title="Discussions"
        lede="Longer conversations about method, markets and mindset."
        aside={threads.source === "sample" ? <SampleTag /> : undefined}
      />
      <ResourceBody
        resource={threads}
        isEmpty={(d) => d.length === 0}
        loading={<Skeleton rows={4} height="4.5rem" />}
        empty={<EmptyState icon={MessageCircle} title="No discussions yet" body="Threads started by members will be listed here." />}
      >
        {(list) => (
          <ul className="flex flex-col gap-3">
            {list.map((t) =>
              open === t.id ? (
                <li key={t.id}>
                  <PostCard post={t} now={now} viewerName={name} />
                  <button type="button" className="z-link mt-2" onClick={() => setOpen(null)}>
                    Collapse thread
                  </button>
                </li>
              ) : (
                <li key={t.id}>
                  <button type="button" className="z-thread" onClick={() => setOpen(t.id)} aria-expanded={false}>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block text-sm font-semibold text-foreground">{t.thread?.title}</span>
                      <span className="block z-meta mt-1">
                        {t.author.name} · {timeAgo(t.createdAt, now)}
                      </span>
                    </span>
                    <Chip>{t.topic}</Chip>
                    <span className="z-thread-count">
                      <MessageCircle size={14} aria-hidden /> {t.comments.length}
                      <span className="sr-only"> replies</span>
                    </span>
                  </button>
                </li>
              ),
            )}
          </ul>
        )}
      </ResourceBody>
    </div>
  );
}
