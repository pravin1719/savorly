import { useNavigate } from "react-router-dom";
import { useState } from "react";

import PageLayout from "../components/layout/PageLayout";
import RecipeForm from "../components/recipe/RecipeForm";

import api from "../services/api";

function AddRecipe() {
  const navigate = useNavigate();

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    recipeData,
    images
  ) => {
    try {
      setSubmitting(true);
      setError("");

      // 1. Create recipe
      const recipeResponse =
        await api.post(
          "/recipes",
          recipeData
        );

      const recipe =
        recipeResponse.data.data;

      // 2. Upload images
      if (
        recipe?._id &&
        images.length > 0
      ) {
        const formData =
          new FormData();

        images.forEach((image) => {
          formData.append(
            "images",
            image
          );
        });

        await api.post(
          `/recipes/${recipe._id}/images`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data"
            }
          }
        );
      }

      // 3. Go to details
      navigate(
        `/recipe/${recipe._id}`
      );

    } catch (error) {
      console.error(
        "Create recipe error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create recipe"
      );

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <RecipeForm
        mode="create"
        onSubmit={handleSubmit}
        submitting={submitting}
      />

    </PageLayout>
  );
}

export default AddRecipe;