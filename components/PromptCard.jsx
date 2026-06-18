"use client";

import { useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

import PromptModal from "./PromptModal";

const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {
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
      <article
        className="card group flex h-full cursor-pointer flex-col gap-4 transition-colors hover:border-accent/25"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-start justify-between gap-4">
          <button
            type="button"
            className="flex flex-1 items-center gap-3 text-left"
            onClick={handleProfileClick}
          >
            <Image
              src={post.creator.image}
              alt={post.creator.username}
              width={36}
              height={36}
              className="rounded-full border border-white/10 object-cover"
            />
            <div className="flex flex-col">
              <h3 className="text-body-sm font-medium text-mint-white">
                {post.creator.username}
              </h3>
              <p className="text-caption text-fog">{post.creator.email}</p>
            </div>
          </button>

          <div className="copy_btn" onClick={handleCopy} title="Copy prompt">
            <Image
              src={
                copied
                  ? "/assets/icons/tick.svg"
                  : "/assets/icons/copy.svg"
              }
              alt={copied ? "copied" : "copy"}
              width={14}
              height={14}
            />
          </div>
        </div>

        <h2 className="font-display text-subheading font-medium leading-snug text-mint-white">
          {post.title}
        </h2>

        <p className="line-clamp-3 text-body-sm leading-relaxed text-ash">
          {post.prompt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <button type="button" className="tag_chip" onClick={stop(() => handleTagClick && handleTagClick(post.tag))}>
            #{post.tag}
          </button>
          <span className="text-caption font-medium text-fog transition-colors group-hover:text-accent">
            Read more →
          </span>
        </div>

        {isOwner && pathName === "/profile" && (
          <>
            <div className="aurora_divider" />
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="text-body-sm font-medium text-accent transition-colors hover:text-mint-white"
                onClick={stop(handleEdit)}
              >
                Edit
              </button>
              <button
                type="button"
                className="text-body-sm font-medium text-fog transition-colors hover:text-mint-white"
                onClick={stop(handleDelete)}
              >
                Delete
              </button>
            </div>
          </>
        )}
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
