import Feed from '@components/Feed'
const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Innovate with AI
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center">
          Provocative Prompts for Thinkers
        </span>
      </h1>
      <p className="desc text-center">
        Prompt-O-Phobia stands as an Open-Source AI prompt tool, designed for the contemporary realm, enabling exploration, generation, and exchange of imaginative cues.      </p>

      <Feed />

    </section>
  )
}

export default Home