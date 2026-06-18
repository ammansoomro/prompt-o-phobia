import Link from "next/link";

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="badge mt-8">
        <span className="text-accent">✦</span>
        {type === "Create" ? "New prompt" : "Editing prompt"}
      </div>

      <h1 className="head_text mt-6 text-left">
        <span className="gradient_text">{type} a prompt</span>
      </h1>
      <p className="desc text-left">
        Give it a clear title so others can find it among the constellations.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Form */}
        <form onSubmit={handleSubmit} className="card flex w-full flex-col gap-6">
          <label>
            <span className="field_label">Title</span>
            <input
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              placeholder="A short, descriptive name…"
              required
              maxLength={80}
              className="input"
            />
          </label>

          <label>
            <span className="field_label">Your AI Prompt</span>
            <textarea
              value={post.prompt}
              onChange={(e) => setPost({ ...post, prompt: e.target.value })}
              placeholder="Write your prompt here…"
              required
              className="textarea h-56"
            />
          </label>

          <label>
            <span className="field_label">
              Tag{" "}
              <span className="font-normal text-fog">
                (#productivity, #webdev, #idea)
              </span>
            </span>
            <input
              value={post.tag}
              onChange={(e) => setPost({ ...post, tag: e.target.value })}
              placeholder="#tag"
              required
              className="input"
            />
          </label>

          <div className="flex items-center justify-end gap-4 pt-2">
            <Link href="/" className="btn_ghost">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn_primary disabled:opacity-60"
            >
              {submitting ? `${type}ing…` : `${type} prompt`}
            </button>
          </div>
        </form>

        {/* Live preview */}
        <div className="flex flex-col gap-4">
          <span className="section_label">Live preview</span>
          <div className="card flex h-fit flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full border border-white/10 bg-elevated" />
              <div className="flex flex-col">
                <span className="text-body-sm font-medium text-mint-white">you</span>
                <span className="text-caption text-fog">your profile</span>
              </div>
            </div>

            <h2 className="font-display text-subheading font-medium leading-snug text-mint-white">
              {post.title || "Your title appears here"}
            </h2>

            <p className="line-clamp-3 text-body-sm leading-relaxed text-ash">
              {post.prompt ||
                "Your prompt preview shows here. The full text opens in a modal when a card is clicked."}
            </p>

            <div className="mt-1 flex items-center justify-between gap-3">
              <span className="tag_chip">#{post.tag || "tag"}</span>
              <span className="text-caption font-medium text-fog">Read more →</span>
            </div>
          </div>
          <p className="text-caption text-fog">
            This is how your prompt will appear in the feed.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Form;
