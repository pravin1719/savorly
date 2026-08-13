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
    const [submitting, setSubmitting] = useState(false);

    // =========================================
    // GET RECIPE
    // =========================================

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

    // =========================================
    // UPDATE RECIPE
    // =========================================

    const handleUpdate = async (
        formData,
        images = []
    ) => {
        try {
            setSubmitting(true);

            // -----------------------------
            // 1. Update recipe details
            // PUT /api/recipes/:id
            // -----------------------------

            await api.put(
                `/recipes/${id}`,
                formData
            );

            // -----------------------------
            // 2. Get only NEW files
            // -----------------------------

            const newImages = images.filter(
                (image) => image instanceof File
            );

            // -----------------------------
            // 3. Upload new images
            // POST /api/recipes/:id/images
            // -----------------------------

            if (newImages.length > 0) {
                const imageFormData =
                    new FormData();

                newImages.forEach((file) => {
                    imageFormData.append(
                        "images",
                        file
                    );
                });

                await api.post(
                    `/recipes/${id}/images`,
                    imageFormData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                );
            }

            // -----------------------------
            // 4. Go to details
            // -----------------------------

            navigate(`/recipe/${id}`);

        } catch (error) {
            console.error(error);

            throw new Error(
                error.response?.data?.message ||
                "Failed to update recipe"
            );

        } finally {
            setSubmitting(false);
        }
    };

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <PageLayout>
                <div className="details-loading">
                    Loading recipe...
                </div>
            </PageLayout>
        );
    }

    // =========================================
    // ERROR
    // =========================================

    if (error || !recipe) {
        return (
            <PageLayout>
                <div className="details-error">

                    <h2>
                        Unable to load recipe
                    </h2>

                    <p>
                        {error ||
                            "Recipe not found"}
                    </p>

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate(
                                `/recipe/${id}`
                            )
                        }
                    >
                        Back to Recipe
                    </button>

                </div>
            </PageLayout>
        );
    }

    // =========================================
    // INITIAL FORM DATA
    // =========================================

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
                              ingredient.name ||
                              "",

                          quantity:
                              ingredient.quantity ||
                              "",

                          unit:
                              ingredient.unit ||
                              "",

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
                              step.description ||
                              "",

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
                mode="edit"
                initialData={initialData}
                onSubmit={handleUpdate}
                submitting={submitting}
            />

        </PageLayout>
    );
}

export default EditRecipe;