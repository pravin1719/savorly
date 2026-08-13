import RecipeCard from "./RecipeCard";

function RecipeGrid({ recipes, loading }) {
  if (loading) {
    return (
      <div className="recipe-grid-loading">
        <div className="loader" />
        <p>Loading recipes...</p>
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="recipe-empty">
        <div className="empty-icon">🍽️</div>

        <h3>No recipes found</h3>

        <p>
          Try changing your search or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe._id}
          recipe={recipe}
        />
      ))}
    </div>
  );
}

export default RecipeGrid;