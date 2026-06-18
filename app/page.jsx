import Feed from "@components/Feed";

const Home = () => {
  return (
    <section className="flex w-full flex-col items-center">
      <div className="badge mt-8">
        <span className="text-accent">✦</span>
        A community of prompt constellations
      </div>

      <h1 className="head_text mt-8 text-center">
        Discover prompts that
        <br className="max-md:hidden" />
        <span className="gradient_text"> make thinking better</span>
      </h1>

      <p className="desc text-center">
        Prompt-O-Phobia is an open-source observatory for AI prompts — explore a
        living feed, search by tag or author, and share your own constellations
        with the world.
      </p>

      <Feed />
    </section>
  );
};

export default Home;
