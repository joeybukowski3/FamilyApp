"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Card from "@/app/components/Card";
import PageHeader from "@/app/components/PageHeader";
import ShellFrame from "@/app/components/ShellFrame";
import Avatar from "@/app/components/Avatar";
import useSupabaseUser from "@/app/lib/useSupabaseUser";
import { familyMembers } from "@/app/lib/mockData";
import {
  PhotoPost,
  getSeedPhotos,
  hydratePhotos,
  savePhotos,
} from "@/app/lib/photosStore";

export default function PhotosPage() {
  const user = useSupabaseUser();
  const [posts, setPosts] = useState<PhotoPost[]>(getSeedPhotos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    setPosts(hydratePhotos());
  }, []);

  const memberLookup = useMemo(() => {
    return new Map(familyMembers.map((member) => [member.id, member]));
  }, []);

  const displayName = useMemo(() => {
    return (
      (user?.user_metadata?.display_name as string | undefined) ?? user?.email
    );
  }, [user?.email, user?.user_metadata?.display_name]);

  const activeMemberId = useMemo(() => {
    if (!user?.email) {
      return familyMembers[0]?.id ?? "family";
    }
    const local = user.email.split("@")[0]?.toLowerCase() ?? "";
    return (
      familyMembers.find(
        (member) =>
          member.id.toLowerCase() === local ||
          member.name.toLowerCase() === local
      )?.id ??
      familyMembers[0]?.id ??
      "family"
    );
  }, [user?.email]);

  const canEdit = Boolean(user);

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
      <div className="space-y-4 accent-coral">
        <PageHeader
          title="Photos"
          subtitle="Shared family photo roll."
          accent="coral"
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 6h5l2-2h6l2 2h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="13"
                r="3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          }
          right={
            canEdit ? (
              <button
                type="button"
                onClick={handleOpenModal}
                className="btnAccent rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
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
            )
          }
        />

        <div className="space-y-4">
          {posts.map((post) => {
            const author = memberLookup.get(post.createdByMemberId);
            const authorLabel =
              post.createdByMemberId === activeMemberId && displayName
                ? displayName
                : author?.name ?? "Family";
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
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <Avatar memberId={post.createdByMemberId} size={28} />
                    <span className="font-semibold text-zinc-600">
                      {authorLabel}
                    </span>
                    <span>
                      {new Date(post.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
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
                        const commentLabel =
                          comment.createdByMemberId === activeMemberId &&
                          displayName
                            ? displayName
                            : commentAuthor?.name ?? "Family";
                        return (
                          <div
                            key={comment.id}
                            className="rounded-2xl bg-zinc-50 px-3 py-2 text-xs text-zinc-600"
                          >
                            <div className="flex items-start gap-2">
                              <Avatar
                                memberId={comment.createdByMemberId}
                                size={22}
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                                  <span className="font-semibold text-zinc-600">
                                    {commentLabel}
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
                            </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 accent-coral">
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
                  className="btnAccent rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
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
