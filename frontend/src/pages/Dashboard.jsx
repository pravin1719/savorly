import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../components/layout/PageLayout";
import RecipeFilters from "../components/recipe/RecipeFilters";
import RecipeGrid from "../components/recipe/RecipeGrid";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/common/LoginModal";
import api from "../services/api";

import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [showLoginModal, setShowLoginModal] =
  useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    cuisine: "",
    foodType: "",
    difficulty: "",
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 9,
    totalPages: 1
  });

  const handleAddRecipe = () => {
  if (isAuthenticated) {
    navigate("/recipes/add");
    return;
  }

  setShowLoginModal(true);
};

  const fetchRecipes = async (
    page = pagination.currentPage
  ) => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: pagination.limit
      };

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.cuisine) {
        params.cuisine = filters.cuisine;
      }

      if (filters.foodType) {
        params.foodType = filters.foodType;
      }

      if (filters.difficulty) {
        params.difficulty = filters.difficulty;
      }

      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
      }

      if (filters.sortOrder) {
        params.sortOrder = filters.sortOrder;
      }

      const response = await api.get(
        "/recipes",
        { params }
      );

      setRecipes(response.data.data || []);

      setPagination(
        response.data.pagination || {
          currentPage: page,
          limit: 9,
          totalPages: 1
        }
      );
    } catch (error) {
      console.error(
        "Failed to fetch recipes:",
        error
      );

      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(1);
  }, [
    filters.cuisine,
    filters.foodType,
    filters.difficulty,
    filters.sortBy,
    filters.sortOrder
  ]);

  const handleSearch = () => {
    fetchRecipes(1);
  };

  const handlePageChange = (page) => {
    fetchRecipes(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <PageLayout>
      <div className="dashboard-page">

        <div className="dashboard-header">

          <div className="dashboard-heading">
            <h2>Explore Recipes</h2>

            <p>
              Discover delicious recipes and
              create your own.
            </p>
          </div>

          <button
            onClick={handleAddRecipe}
             className="add-recipe-button"
            >           
            + Add Recipe
          </button>
          <LoginModal
            isOpen={showLoginModal}
            onClose={() =>
                setShowLoginModal(false)
            }
            onSuccess={() => {
                setShowLoginModal(false);
                navigate("/recipes/add");
            }}
            />

        </div>

        <RecipeFilters
          filters={filters}
          onChange={setFilters}
          onSearch={handleSearch}
        />

        <RecipeGrid
          recipes={recipes}
          loading={loading}
        />

        {pagination.totalPages > 1 && (
          <div className="pagination">
            {Array.from(
              {
                length: pagination.totalPages
              },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                className={
                  page === pagination.currentPage
                    ? "pagination-active"
                    : ""
                }
                onClick={() =>
                  handlePageChange(page)
                }
              >
                {page}
              </button>
            ))}
          </div>
        )}

      </div>
    </PageLayout>
  );
}

export default Dashboard;