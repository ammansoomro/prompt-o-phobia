"use client";

import { useState, useEffect, useRef } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="prompt_list w-full">
      {data.map((post, index) => (
        <PromptCard
          key={post.id}
          post={post}
          index={index}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const searchTimeout = useRef(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();
    setAllPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const needle = searchtext.toLowerCase();
    return allPosts.filter(
      (item) =>
        item.creator.username.toLowerCase().includes(needle) ||
        item.tag.toLowerCase().includes(needle) ||
        item.title.toLowerCase().includes(needle) ||
        item.prompt.toLowerCase().includes(needle)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout.current);
    setSearchText(e.target.value);
    searchTimeout.current = setTimeout(
      () => setSearchedResults(filterPrompts(e.target.value)),
      400
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    setSearchedResults(filterPrompts(tagName));
  };

  const data = searchText ? searchedResults : allPosts;

  return (
    <section className="mt-16 w-full">
      {/* Search */}
      <div className="search_wrap">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ash">
          ⌕
        </span>
        <input
          type="text"
          placeholder="Search by tag, title, author, or content…"
          value={searchText}
          onChange={handleSearchChange}
          className="input pl-10"
        />
        {searchText && (
          <button
            type="button"
            onClick={() => {
              setSearchText("");
              setSearchedResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-caption text-fog hover:text-mint-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Dashboard header */}
      <div className="mt-12 flex items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="section_label">
            {searchText ? "Search results" : "Explore the constellation"}
          </span>
          <h2 className="font-display text-subheading font-medium text-mint-white">
            {searchText ? `“${searchText}”` : "Community prompts"}
          </h2>
        </div>
        <span className="stat_pill">
          <span className="text-accent">✦</span>
          {data.length} {data.length === 1 ? "prompt" : "prompts"}
        </span>
      </div>

      <div className="aurora_divider mt-5" />

      {/* Grid */}
      {loading ? (
        <div className="flex-center mt-20 w-full">
          <div className="spinner" />
        </div>
      ) : data.length > 0 ? (
        <div className="mt-2">
          <PromptCardList data={data} handleTagClick={handleTagClick} />
        </div>
      ) : (
        <p className="mt-20 text-center text-body-sm text-fog">
          {searchText
            ? "No prompts match your search yet."
            : "No prompts in the sky yet — be the first to share one."}
        </p>
      )}
    </section>
  );
};

export default Feed;
