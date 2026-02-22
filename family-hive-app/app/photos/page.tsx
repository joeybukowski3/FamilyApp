"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Card from "@/app/components/Card";
import ShellFrame from "@/app/components/ShellFrame";
import { familyMembers } from "@/app/lib/mockData";
import {
  PhotoPost,
  getSeedPhotos,
  hydratePhotos,
  savePhotos,
} from "@/app/lib/photosStore";

export default function PhotosPage() {
  const [posts, setPosts] = useState<PhotoPost[]>(getSeedPhotos);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    setPosts(hydratePhotos());

    if (typeof window === "undefined") return;
    const storedSession = window.localStorage.getItem("family-hive-session");
    if (!storedSession) return;

    try {
      const parsed = JSON.parse(storedSession) as {
        memberId?: string;
        unlocked?: boolean;
      };
      if (parsed.unlocked && parsed.memberId) {
        setActiveMemberId(parsed.memberId);
      }
    } catch {
      window.localStorage.removeItem("family-hive-session");
    }
  }, []);

  const memberLookup = useMemo(() => {
    return new Map(familyMembers.map((member) => [member.id, member]));
  }, []);

  const canEdit = Boolean(activeMemberId);

  const handleOpenModal = () => {
    if (!canEdit) return;
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreatePost = () => {
    if (!canEdit || !activeMemberId) return;
    const trimmedUrl = imageUrl.trim();
    const trimmedCaption = caption.trim();
    if (!trimmedUrl || !trimmedCaption) return;

    const nextPost: PhotoPost = {
      id: `photo-${Date.now()}`,
      imageUrl: trimmedUrl,
      caption: trimmedCaption,
      createdAt: new Date().toISOString(),
      createdByMemberId: activeMemberId,
      comments: [],
    };

    setPosts((prev) => {
      const updated = [nextPost, ...prev];
      savePhotos(updated);
      return updated;
    });

    setImageUrl("");
    setCaption("");
    setIsModalOpen(false);
  };

  const handleAddComment = (postId: string) => {
    if (!canEdit || !activeMemberId) return;
    const draft = commentDrafts[postId]?.trim();
    if (!draft) return;

    setPosts((prev) => {
      const updated = prev.map((post) => {
        if (post.id !== postId) return post;
        const nextComment = {
          id: `comment-${Date.now()}`,
          text: draft,
          createdAt: new Date().toISOString(),
          createdByMemberId: activeMemberId,
        };
        return { ...post, comments: [...post.comments, nextComment] };
      });
      savePhotos(updated);
      return updated;
    });

    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <ShellFrame>
      <div className="space-y-4">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-zinc-700">Photos</div>
              <div className="text-xs text-zinc-400">
                Shared family photo roll
              </div>
            </div>
            {canEdit ? (
              <button
                type="button"
                onClick={handleOpenModal}
                className="btnPrimary rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
              >
                New Post
              </button>
            ) : (
              <div className="text-xs text-zinc-500">
                Unlock to post.{" "}
                <Link href="/unlock" className="font-semibold text-zinc-700">
                  Go to unlock
                </Link>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          {posts.map((post) => {
            const author = memberLookup.get(post.createdByMemberId);
            return (
              <Card key={post.id}>
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
                    <img
                      src={post.imageUrl}
                      alt={post.caption}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-sm text-zinc-700">{post.caption}</div>
                  <div className="text-xs text-zinc-400">
                    <span className="font-semibold text-zinc-600">
                      {author?.name ?? "Family"}
                    </span>{" "}
                    -{" "}
                    {new Date(post.createdAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                      Comments
                    </div>
                    {post.comments.length === 0 ? (
                      <div className="text-xs text-zinc-400">
                        No comments yet.
                      </div>
                    ) : (
                      post.comments.map((comment) => {
                        const commentAuthor = memberLookup.get(
                          comment.createdByMemberId
                        );
                        return (
                          <div
                            key={comment.id}
                            className="rounded-2xl bg-zinc-50 px-3 py-2 text-xs text-zinc-600"
                          >
                            <div className="flex items-center justify-between text-[11px] text-zinc-400">
                              <span className="font-semibold text-zinc-600">
                                {commentAuthor?.name ?? "Family"}
                              </span>
                              <span>
                                {new Date(comment.createdAt).toLocaleString(
                                  undefined,
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="mt-1">{comment.text}</div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {canEdit ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        value={commentDrafts[post.id] ?? ""}
                        onChange={(event) =>
                          setCommentDrafts((prev) => ({
                            ...prev,
                            [post.id]: event.target.value,
                          }))
                        }
                        placeholder="Add a comment..."
                        className="flex-1 rounded-full border border-zinc-200 px-4 py-2 text-xs text-zinc-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post.id)}
                        className="rounded-full border border-zinc-200 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500"
                      >
                        Add Comment
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-400">
                      Unlock to comment.{" "}
                      <Link
                        href="/unlock"
                        className="font-semibold text-zinc-700"
                      >
                        Go to unlock
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <Card className="w-full max-w-lg">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-zinc-700">
                New Photo Post
              </div>
              <input
                type="text"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="Image URL"
                className="w-full rounded-full border border-zinc-200 px-4 py-2 text-xs text-zinc-600"
              />
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="Caption"
                className="min-h-[96px] w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-full border border-zinc-200 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreatePost}
                  className="btnPrimary rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                >
                  Post
                </button>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </ShellFrame>
  );
}
