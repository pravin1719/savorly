import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageLayout from "../components/layout/PageLayout";
import api from "../services/api";

import "../styles/recipe-details.css";

function RecipeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeImage, setActiveImage] =
        useState(0);

    // =========================================
    // DELETE STATES
    // =========================================

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    // =========================================
    // RATING STATES
    // =========================================

    const [selectedRating, setSelectedRating] =
        useState(0);

    const [ratingSubmitting, setRatingSubmitting] =
        useState(false);

    // =========================================
    // FETCH RECIPE
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
    // DELETE RECIPE
    // =========================================

    const handleDelete = async () => {
        try {
            setDeleting(true);

            await api.delete(
                `/recipes/${recipe._id}`
            );

            setShowDeleteModal(false);

            navigate("/");
        } catch (error) {
            console.error(
                "Failed to delete recipe:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to delete recipe"
            );

            setShowDeleteModal(false);
        } finally {
            setDeleting(false);
        }
    };

    // =========================================
    // RATE RECIPE
    // =========================================

    const handleRating = async () => {
        if (!selectedRating) {
            return;
        }

        try {
            setRatingSubmitting(true);

            const response = await api.post(
                `/recipes/${recipe._id}/rating`,
                {
                    rating: selectedRating
                }
            );

            setRecipe((previous) => ({
                ...previous,
                rating: response.data.data
            }));

            setSelectedRating(0);
        } catch (error) {
            console.error(
                "Failed to submit rating:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to submit rating"
            );
        } finally {
            setRatingSubmitting(false);
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
                        Recipe not found
                    </h2>

                    <p>
                        {error ||
                            "The requested recipe does not exist."}
                    </p>

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Back to Recipes
                    </button>
                </div>
            </PageLayout>
        );
    }

    // =========================================
    // IMAGES
    // =========================================

    const images =
        recipe.images?.length > 0
            ? recipe.images
            : recipe.image
              ? [recipe.image]
              : [];

    const getImageUrl = (image) => {
        if (!image?.url) {
            return null;
        }

        if (
            image.url.startsWith("http")
        ) {
            return image.url;
        }

        return `http://localhost:5000${image.url}`;
    };

    // =========================================
    // UI
    // =========================================

    return (
        <PageLayout>
            <div className="recipe-details">

                {/* =====================================
                    TOP BAR
                ===================================== */}

                <div className="details-topbar">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        ← Back to Recipes
                    </button>

                    <div className="details-actions">

                        <button
                            className="edit-button"
                            onClick={() =>
                                navigate(
                                    `/recipes/edit/${recipe._id}`
                                )
                            }
                        >
                            ✎ Edit Recipe
                        </button>

                        <button
                            className="delete-button"
                            onClick={() =>
                                setShowDeleteModal(
                                    true
                                )
                            }
                        >
                            🗑 Delete
                        </button>

                    </div>
                </div>

                {/* =====================================
                    HERO
                ===================================== */}

                <section className="recipe-hero">

                    {/* =================================
                        GALLERY
                    ================================= */}

                    <div className="recipe-gallery">

                        <div className="main-recipe-image">

                            {images.length > 0 ? (
                                <img
                                    src={getImageUrl(
                                        images[
                                            activeImage
                                        ]
                                    )}
                                    alt={
                                        recipe.title
                                    }
                                />
                            ) : (
                                <div className="no-image">
                                    🍽️

                                    <span>
                                        No image available
                                    </span>
                                </div>
                            )}

                        </div>

                        {images.length > 1 && (
                            <div className="thumbnail-list">

                                {images.map(
                                    (
                                        image,
                                        index
                                    ) => (
                                        <button
                                            key={
                                                image.filename ||
                                                index
                                            }
                                            className={
                                                index ===
                                                activeImage
                                                    ? "thumbnail active"
                                                    : "thumbnail"
                                            }
                                            onClick={() =>
                                                setActiveImage(
                                                    index
                                                )
                                            }
                                        >
                                            <img
                                                src={getImageUrl(
                                                    image
                                                )}
                                                alt={`Recipe ${
                                                    index +
                                                    1
                                                }`}
                                            />
                                        </button>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                    {/* =================================
                        RECIPE SUMMARY
                    ================================= */}

                    <div className="recipe-summary">

                        {/* BADGES */}

                        <div className="summary-badges">

                            <span>
                                {
                                    recipe.cuisine
                                }
                            </span>

                            <span>
                                {
                                    recipe.foodType
                                }
                            </span>

                            <span>
                                {
                                    recipe.difficulty
                                }
                            </span>

                        </div>

                        {/* TITLE */}

                        <h1>
                            {recipe.title}
                        </h1>

                        {/* CURRENT RATING */}

                        <div className="recipe-rating-large">

                            ⭐{" "}
                            {recipe.rating?.average?.toFixed(
                                1
                            ) || "0.0"}

                            <span>
                                (
                                {recipe.rating
                                    ?.count ||
                                    0}{" "}
                                ratings)
                            </span>

                        </div>

                        {/* =================================
                            GIVE RATING
                        ================================= */}

                        <div className="give-rating">

                            <div className="give-rating-title">
                                Rate this recipe
                            </div>

                            <div className="rating-stars">

                                {[
                                    1,
                                    2,
                                    3,
                                    4,
                                    5
                                ].map(
                                    (star) => (
                                        <button
                                            key={
                                                star
                                            }
                                            type="button"
                                            className={
                                                star <=
                                                selectedRating
                                                    ? "rating-star active"
                                                    : "rating-star"
                                            }
                                            onClick={() =>
                                                setSelectedRating(
                                                    star
                                                )
                                            }
                                            aria-label={`Rate ${star} stars`}
                                        >
                                            ★
                                        </button>
                                    )
                                )}

                            </div>

                            <button
                                type="button"
                                className="submit-rating-button"
                                onClick={
                                    handleRating
                                }
                                disabled={
                                    !selectedRating ||
                                    ratingSubmitting
                                }
                            >
                                {ratingSubmitting
                                    ? "Submitting..."
                                    : "Submit Rating"}
                            </button>

                        </div>

                        {/* DESCRIPTION */}

                        <p className="recipe-summary-description">
                            {
                                recipe.description
                            }
                        </p>

                        {/* RECIPE INFO */}

                        <div className="recipe-info-grid">

                            <div className="recipe-info">

                                <span>
                                    ⏱
                                </span>

                                <div>

                                    <strong>
                                        {
                                            recipe.preparationTime
                                        }{" "}
                                        mins
                                    </strong>

                                    <small>
                                        Preparation
                                    </small>

                                </div>

                            </div>

                            <div className="recipe-info">

                                <span>
                                    🔥
                                </span>

                                <div>

                                    <strong>
                                        {
                                            recipe.cookingTime
                                        }{" "}
                                        mins
                                    </strong>

                                    <small>
                                        Cooking
                                    </small>

                                </div>

                            </div>

                            <div className="recipe-info">

                                <span>
                                    👥
                                </span>

                                <div>

                                    <strong>
                                        {
                                            recipe.servingSize
                                        }
                                    </strong>

                                    <small>
                                        Servings
                                    </small>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* =====================================
                    INGREDIENTS + STEPS
                ===================================== */}

                <section className="recipe-content">

                    {/* INGREDIENTS */}

                    <div className="ingredients-section">

                        <div className="content-heading">

                            <h2>
                                Ingredients
                            </h2>

                            <span>
                                {
                                    recipe
                                        .ingredients
                                        ?.length ||
                                    0
                                }{" "}
                                items
                            </span>

                        </div>

                        <div className="ingredients-list">

                            {recipe.ingredients?.map(
                                (
                                    ingredient,
                                    index
                                ) => (
                                    <div
                                        className="ingredient-row"
                                        key={
                                            index
                                        }
                                    >

                                        <span className="ingredient-order">
                                            {index +
                                                1}
                                        </span>

                                        <span className="ingredient-name">
                                            {
                                                ingredient.name
                                            }
                                        </span>

                                        <span className="ingredient-quantity">
                                            {
                                                ingredient.quantity
                                            }{" "}
                                            {
                                                ingredient.unit
                                            }
                                        </span>

                                    </div>
                                )
                            )}

                        </div>

                    </div>

                    {/* STEPS */}

                    <div className="steps-section">

                        <div className="content-heading">

                            <h2>
                                Cooking Directions
                            </h2>

                            <span>
                                {
                                    recipe.steps
                                        ?.length ||
                                    0
                                }{" "}
                                steps
                            </span>

                        </div>

                        <div className="steps-list">

                            {recipe.steps?.map(
                                (
                                    step,
                                    index
                                ) => (
                                    <div
                                        className="detail-step"
                                        key={
                                            index
                                        }
                                    >

                                        <span className="step-number">
                                            {index +
                                                1}
                                        </span>

                                        <p>
                                            {
                                                step.description
                                            }
                                        </p>

                                    </div>
                                )
                            )}

                        </div>

                    </div>

                </section>

                {/* =====================================
                    DELETE CONFIRMATION MODAL
                ===================================== */}

                {showDeleteModal && (
                    <div
                        className="delete-modal-overlay"
                        onClick={() => {
                            if (
                                !deleting
                            ) {
                                setShowDeleteModal(
                                    false
                                );
                            }
                        }}
                    >

                        <div
                            className="delete-modal"
                            onClick={(
                                event
                            ) =>
                                event.stopPropagation()
                            }
                        >

                            <button
                                type="button"
                                className="delete-modal-close"
                                onClick={() =>
                                    setShowDeleteModal(
                                        false
                                    )
                                }
                                disabled={
                                    deleting
                                }
                            >
                                ×
                            </button>

                            <div className="delete-modal-icon">
                                🗑
                            </div>

                            <h2>
                                Delete Recipe?
                            </h2>

                            <p>
                                Are you sure you
                                want to delete{" "}
                                <strong>
                                    "{recipe.title}"
                                </strong>
                                ?
                            </p>

                            <span className="delete-modal-warning">
                                This action cannot
                                be undone.
                            </span>

                            <div className="delete-modal-actions">

                                <button
                                    type="button"
                                    className="delete-cancel-button"
                                    onClick={() =>
                                        setShowDeleteModal(
                                            false
                                        )
                                    }
                                    disabled={
                                        deleting
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="delete-confirm-button"
                                    onClick={
                                        handleDelete
                                    }
                                    disabled={
                                        deleting
                                    }
                                >
                                    {deleting
                                        ? "Deleting..."
                                        : "Delete Recipe"}
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            </div>
        </PageLayout>
    );
}

export default RecipeDetails;