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
        images = []
    ) => {
        try {
            setSubmitting(true);
            setError("");

            // =========================================
            // 1. CREATE RECIPE
            // POST /api/recipes
            // =========================================

            const recipeResponse =
                await api.post(
                    "/recipes",
                    recipeData
                );

            const recipe =
                recipeResponse.data.data;

            if (!recipe?._id) {
                throw new Error(
                    "Recipe was created but recipe ID was not returned"
                );
            }

            // =========================================
            // 2. UPLOAD RECIPE IMAGES
            // POST /api/recipes/:id/images
            // =========================================

            if (images?.length > 0) {
                const imageFormData =
                    new FormData();

                images.forEach((image) => {
                    if (image instanceof File) {
                        imageFormData.append(
                            "images",
                            image
                        );
                    }
                });

                await api.post(
                    `/recipes/${recipe._id}/images`,
                    imageFormData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                );
            }

            // =========================================
            // 3. GO TO RECIPE DETAILS
            // =========================================

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
                error.message ||
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