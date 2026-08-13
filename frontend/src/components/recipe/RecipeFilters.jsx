function RecipeFilters({
  filters,
  onChange,
  onSearch
}) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    onChange({
      ...filters,
      [name]: value
    });
  };

  return (
    <section className="recipe-filters">

      <div className="recipe-search">
        <span>⌕</span>

        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearch();
            }
          }}
          placeholder="Search recipes..."
        />

        <button
          type="button"
          onClick={onSearch}
        >
          Search
        </button>
      </div>

      <div className="filter-row">

        <select
          name="cuisine"
          value={filters.cuisine}
          onChange={handleChange}
        >
          <option value="">All Cuisines</option>
          <option value="Indian">Indian</option>
          <option value="Italian">Italian</option>
          <option value="Chinese">Chinese</option>
          <option value="Mexican">Mexican</option>
        </select>

        <select
          name="foodType"
          value={filters.foodType}
          onChange={handleChange}
        >
          <option value="">All Food Types</option>
          <option value="Vegetarian">
            Vegetarian
          </option>
          <option value="Non-Vegetarian">
            Non-Vegetarian
          </option>
          <option value="Vegan">
            Vegan
          </option>
          <option value="Egg">
            Egg
          </option>
        </select>

        <select
          name="difficulty"
          value={filters.difficulty}
          onChange={handleChange}
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleChange}
        >
          <option value="createdAt">
            Newest
          </option>

          <option value="rating">
            Highest Rated
          </option>

          <option value="title">
            Name
          </option>

          <option value="preparationTime">
            Preparation Time
          </option>
        </select>

        <select
          name="sortOrder"
          value={filters.sortOrder}
          onChange={handleChange}
        >
          <option value="desc">
            Descending
          </option>

          <option value="asc">
            Ascending
          </option>
        </select>

      </div>
    </section>
  );
}

export default RecipeFilters;