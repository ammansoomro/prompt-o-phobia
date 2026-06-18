"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Full-prompt overlay. Cards show only a preview; the complete prompt lives
// here, opened on card click. Closes on backdrop click or Escape.
const PromptModal = ({ post, onClose, onTagClick }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(post.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleTag = () => {
    if (onTagClick) onTagClick(post.tag);
    onClose();
  };

  return (
    <div className="modal_overlay" onClick={onClose}>
      <div
        className="modal_panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={post.creator.image}
              alt={post.creator.username}
              width={40}
              height={40}
              className="rounded-full border border-white/10 object-cover"
            />
            <div className="flex flex-col">
              <span className="text-body-sm font-medium text-mint-white">
                {post.creator.username}
              </span>
              <span className="text-caption text-fog">{post.creator.email}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="copy_btn"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <h2 className="mt-6 font-display text-heading-sm font-medium leading-tight text-mint-white">
          {post.title}
        </h2>

        <div className="aurora_divider mt-5" />

        <div className="modal_body mt-5">
          <p className="whitespace-pre-wrap text-body leading-relaxed text-ash">
            {post.prompt}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <button type="button" className="tag_chip" onClick={handleTag}>
            #{post.tag}
          </button>

          <button type="button" className="btn_primary" onClick={handleCopy}>
            {copied ? "Copied ✓" : "Copy prompt"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
