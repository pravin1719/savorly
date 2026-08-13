import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageLayout from "../components/layout/PageLayout";
import RecipeForm from "../components/recipe/RecipeForm";
import api from "../services/api";

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/recipes/${id}`
        );

        setRecipe(response.data.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load recipe"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await api.put(
        `/recipes/${id}`,
        formData
      );

      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error(error);

      throw new Error(
        error.response?.data?.message ||
          "Failed to update recipe"
      );
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="details-loading">
          Loading recipe...
        </div>
      </PageLayout>
    );
  }

  if (error || !recipe) {
    return (
      <PageLayout>
        <div className="details-error">
          <h2>Unable to load recipe</h2>

          <p>
            {error || "Recipe not found"}
          </p>

          <button
            className="primary-button"
            onClick={() =>
              navigate(`/recipe/${id}`)
            }
          >
            Back to Recipe
          </button>
        </div>
      </PageLayout>
    );
  }

  const initialData = {
    title: recipe.title || "",

    description:
      recipe.description || "",

    preparationTime:
      recipe.preparationTime ?? "",

    cookingTime:
      recipe.cookingTime ?? "",

    servingSize:
      recipe.servingSize ?? "",

    cuisine:
      recipe.cuisine || "",

    foodType:
      recipe.foodType || "",

    difficulty:
      recipe.difficulty || "",

    ingredients:
      recipe.ingredients?.length
        ? recipe.ingredients.map(
            (ingredient, index) => ({
              name:
                ingredient.name || "",

              quantity:
                ingredient.quantity || "",

              unit:
                ingredient.unit || "",

              order:
                ingredient.order ||
                index + 1
            })
          )
        : [],

    steps:
      recipe.steps?.length
        ? recipe.steps.map(
            (step, index) => ({
              description:
                step.description || "",

              order:
                step.order ||
                index + 1
            })
          )
        : [],

    images:
      recipe.images?.length
        ? recipe.images
        : recipe.image
          ? [recipe.image]
          : []
  };

  return (
    <PageLayout>
      <RecipeForm
        initialData={initialData}
        onSubmit={handleUpdate}
        submitLabel="Update Recipe"
        isEdit={true}
      />
    </PageLayout>
  );
}

export default EditRecipe;