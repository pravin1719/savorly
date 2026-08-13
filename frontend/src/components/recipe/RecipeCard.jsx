import { useNavigate } from "react-router-dom";

function RecipeCard({ recipe }) {
  const navigate = useNavigate();

  const getImageUrl = () => {
  const url =
    recipe.images?.[0]?.url ||
    recipe.image?.url;

  if (!url) {
    return "https://via.placeholder.com/400x250?text=No+Image";
  }

  if (url.startsWith("http")) {
    return url;
  }

  return `http://localhost:5000${url}`;
};

const imageUrl = getImageUrl();

  return (
    <article
      className="recipe-card"
      onClick={() => navigate(`/recipe/${recipe._id}`)}
    >
      <div className="recipe-card-image-wrapper">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="recipe-card-image"
        />

        <span className="recipe-difficulty">
          {recipe.difficulty}
        </span>
      </div>

      <div className="recipe-card-body">
        <div className="recipe-card-top">
          <span className="recipe-cuisine">
            {recipe.cuisine}
          </span>

          <span className="recipe-rating">
            ⭐ {recipe.rating?.average?.toFixed(1) || "0.0"}
          </span>
        </div>

        <h3>{recipe.title}</h3>

        <p className="recipe-description">
          {recipe.description}
        </p>

        <div className="recipe-meta">
          <span>
            ⏱ {recipe.preparationTime + recipe.cookingTime} min
          </span>

          <span>
            👥 {recipe.servingSize}
          </span>

          <span>
            {recipe.foodType}
          </span>
        </div>
      </div>
    </article>
  );
}

export default RecipeCard;