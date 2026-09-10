"use client";

import { useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

import PromptModal from "./PromptModal";

const PromptCard = ({ post, index, handleEdit, handleDelete, handleTagClick }) => {
  const { user } = useUser();
  const pathName = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOwner = user?.id && post.creator?.clerkId === user.id;

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (isOwner) return router.push("/profile");
    router.push(`/profile/${post.creator.id}?name=${post.creator.username}`);
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(post.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn && fn();
  };

  return (
    <>
      <article className="prompt_row group" onClick={() => setOpen(true)}>
        <span className="prompt_row_index">
          {String((index ?? 0) + 1).padStart(2, "0")}
        </span>

        <button
          type="button"
          className="shrink-0"
          onClick={handleProfileClick}
          title={post.creator.username}
        >
          <Image
            src={post.creator.image}
            alt={post.creator.username}
            width={38}
            height={38}
            className="rounded-full border border-white/10 object-cover"
          />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="font-display text-body font-medium leading-snug text-mint-white">
              {post.title}
            </h2>
            <button
              type="button"
              className="tag_chip"
              onClick={stop(() => handleTagClick && handleTagClick(post.tag))}
            >
              #{post.tag}
            </button>
          </div>

          <p className="mt-1.5 line-clamp-1 text-body-sm text-ash">
            {post.prompt}
          </p>

          <div className="mt-2 flex items-center gap-3 text-caption text-fog">
            <span>{post.creator.username}</span>
            {isOwner && pathName === "/profile" && (
              <>
                <span className="text-white/10">·</span>
                <button
                  type="button"
                  className="font-medium text-accent transition-colors hover:text-mint-white"
                  onClick={stop(handleEdit)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="font-medium text-fog transition-colors hover:text-mint-white"
                  onClick={stop(handleDelete)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="copy_btn" onClick={handleCopy} title="Copy prompt">
            <Image
              src={copied ? "/assets/icons/tick.svg" : "/assets/icons/copy.svg"}
              alt={copied ? "copied" : "copy"}
              width={14}
              height={14}
            />
          </div>
        </div>
      </article>

      {open && (
        <PromptModal
          post={post}
          onClose={() => setOpen(false)}
          onTagClick={handleTagClick}
        />
      )}
    </>
  );
};

export default PromptCard;
