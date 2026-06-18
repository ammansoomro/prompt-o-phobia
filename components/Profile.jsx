import PromptCard from "./PromptCard";

const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {
  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="gradient_text">{name}</span>
      </h1>
      <p className="desc text-left">{desc}</p>

      {data.length > 0 ? (
        <div className="prompt_grid">
          {data.map((post) => (
            <PromptCard
              key={post.id}
              post={post}
              handleEdit={() => handleEdit && handleEdit(post)}
              handleDelete={() => handleDelete && handleDelete(post)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-body-sm text-fog">No prompts here yet.</p>
      )}
    </section>
  );
};

export default Profile;
