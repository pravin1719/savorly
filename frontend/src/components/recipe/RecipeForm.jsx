import { useEffect, useState } from "react";

import IngredientList from "./IngredientList";
import StepList from "./StepList";
import ImageUploader from "./ImageUploader";

import "../../styles/recipe-form.css";

const emptyIngredient = {
  name: "",
  quantity: "",
  unit: ""
};

const emptyStep = {
  description: ""
};

const initialForm = {
  title: "",
  description: "",
  preparationTime: "",
  cookingTime: "",
  servingSize: "",
  cuisine: "",
  foodType: "Vegetarian",
  difficulty: "Easy",

  ingredients: [
    { ...emptyIngredient }
  ],

  steps: [
    { ...emptyStep }
  ]
};

function RecipeForm({
  mode = "create",
  initialData = null,
  onSubmit,
  submitting = false
}) {
  const [formData, setFormData] =
    useState(initialForm);

  /*
   * Images are kept separately because
   * ImageUploader works with its own
   * images state.
   */
  const [images, setImages] = useState([]);

  // =========================================
  // LOAD INITIAL DATA
  // =========================================

  useEffect(() => {
    if (!initialData) {
      return;
    }

    setFormData({
      title: initialData.title || "",

      description:
        initialData.description || "",

      preparationTime:
        initialData.preparationTime ?? "",

      cookingTime:
        initialData.cookingTime ?? "",

      servingSize:
        initialData.servingSize ?? "",

      cuisine:
        initialData.cuisine || "",

      foodType:
        initialData.foodType ||
        "Vegetarian",

      difficulty:
        initialData.difficulty ||
        "Easy",

      ingredients:
        initialData.ingredients?.length
          ? initialData.ingredients.map(
              (ingredient) => ({
                name:
                  ingredient.name || "",

                quantity:
                  ingredient.quantity || "",

                unit:
                  ingredient.unit || ""
              })
            )
          : [{ ...emptyIngredient }],

      steps:
        initialData.steps?.length
          ? initialData.steps.map(
              (step) => ({
                description:
                  step.description || ""
              })
            )
          : [{ ...emptyStep }]
    });

    /*
     * IMPORTANT:
     * Load existing recipe images
     * into ImageUploader.
     */
    setImages(
      initialData.images?.length
        ? initialData.images
        : initialData.image
          ? [initialData.image]
          : []
    );
  }, [initialData]);

  // =========================================
  // HANDLE BASIC FIELD CHANGE
  // =========================================

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      title:
        formData.title.trim(),

      description:
        formData.description.trim(),

      preparationTime:
        Number(formData.preparationTime),

      cookingTime:
        Number(formData.cookingTime),

      servingSize:
        Number(formData.servingSize),

      cuisine:
        formData.cuisine.trim(),

      foodType:
        formData.foodType,

      difficulty:
        formData.difficulty,

      ingredients:
        formData.ingredients.map(
          (ingredient, index) => ({
            name:
              ingredient.name.trim(),

            quantity:
              ingredient.quantity.trim(),

            unit:
              ingredient.unit.trim(),

            order: index + 1
          })
        ),

      steps:
        formData.steps.map(
          (step, index) => ({
            description:
              step.description.trim(),

            order: index + 1
          })
        )
    };

    /*
     * Send payload + images.
     *
     * Existing images are included here
     * during edit as well.
     */
    await onSubmit(
      payload,
      images
    );
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <form
      className="recipe-form"
      onSubmit={handleSubmit}
    >

      {/* =====================================
          BASIC INFORMATION
      ===================================== */}

      <section className="form-section">

        <div className="form-section-header">
          <div>

            <h2>
              Basic Information
            </h2>

            <p>
              {mode === "edit"
                ? "Update the basic details of your recipe."
                : "Add the basic details about your recipe."}
            </p>

          </div>
        </div>

        <div className="form-grid">

          {/* TITLE */}

          <div className="form-group form-group-full">

            <label htmlFor="title">
              Recipe Title *
            </label>

            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter recipe title"
              maxLength={150}
              required
            />

          </div>

          {/* DESCRIPTION */}

          <div className="form-group form-group-full">

            <label htmlFor="description">
              Description *
            </label>

            <textarea
              id="description"
              name="description"
              value={
                formData.description
              }
              onChange={handleChange}
              placeholder="Describe your recipe..."
              rows={4}
              maxLength={2000}
              required
            />

          </div>

          {/* PREPARATION */}

          <div className="form-group">

            <label htmlFor="preparationTime">
              Preparation Time (minutes) *
            </label>

            <input
              id="preparationTime"
              name="preparationTime"
              type="number"
              min="0"
              value={
                formData.preparationTime
              }
              onChange={handleChange}
              required
            />

          </div>

          {/* COOKING */}

          <div className="form-group">

            <label htmlFor="cookingTime">
              Cooking Time (minutes) *
            </label>

            <input
              id="cookingTime"
              name="cookingTime"
              type="number"
              min="0"
              value={
                formData.cookingTime
              }
              onChange={handleChange}
              required
            />

          </div>

          {/* SERVING */}

          <div className="form-group">

            <label htmlFor="servingSize">
              Serving Size *
            </label>

            <input
              id="servingSize"
              name="servingSize"
              type="number"
              min="1"
              value={
                formData.servingSize
              }
              onChange={handleChange}
              required
            />

          </div>

          {/* CUISINE */}

          <div className="form-group">

            <label htmlFor="cuisine">
              Cuisine *
            </label>

            <input
              id="cuisine"
              name="cuisine"
              value={
                formData.cuisine
              }
              onChange={handleChange}
              placeholder="e.g. Indian"
              required
            />

          </div>

          {/* FOOD TYPE */}

          <div className="form-group">

            <label htmlFor="foodType">
              Food Type *
            </label>

            <select
              id="foodType"
              name="foodType"
              value={
                formData.foodType
              }
              onChange={handleChange}
            >

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

          </div>

          {/* DIFFICULTY */}

          <div className="form-group">

            <label htmlFor="difficulty">
              Difficulty *
            </label>

            <select
              id="difficulty"
              name="difficulty"
              value={
                formData.difficulty
              }
              onChange={handleChange}
            >

              <option value="Easy">
                Easy
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Hard">
                Hard
              </option>

            </select>

          </div>

        </div>
      </section>

      {/* =====================================
          IMAGES
      ===================================== */}

      <section className="form-section">

        <div className="form-section-header">
          <div>

            <h2>
              Recipe Images
            </h2>

            <p>
              {mode === "edit"
                ? "Manage your existing recipe images or add new ones."
                : "Upload images for your recipe."}
            </p>

          </div>
        </div>

        <ImageUploader
          images={images}
          onChange={setImages}
          maxImages={5}
        />

      </section>

      {/* =====================================
          INGREDIENTS
      ===================================== */}

      <section className="form-section">

        <div className="form-section-header">
          <div>

            <h2>
              Ingredients
            </h2>

            <p>
              Add ingredients and
              drag them to reorder.
            </p>

          </div>
        </div>

        <IngredientList
          ingredients={
            formData.ingredients
          }
          onChange={(ingredients) =>
            setFormData(
              (previous) => ({
                ...previous,
                ingredients
              })
            )
          }
        />

      </section>

      {/* =====================================
          STEPS
      ===================================== */}

      <section className="form-section">

        <div className="form-section-header">
          <div>

            <h2>
              Cooking Directions
            </h2>

            <p>
              Add cooking steps and
              drag to reorder.
            </p>

          </div>
        </div>

        <StepList
          steps={formData.steps}
          onChange={(steps) =>
            setFormData(
              (previous) => ({
                ...previous,
                steps
              })
            )
          }
        />

      </section>

      {/* =====================================
          SUBMIT
      ===================================== */}

      <div className="form-actions">

        <button
          type="submit"
          className="primary-button"
          disabled={submitting}
        >
          {submitting
            ? "Saving..."
            : mode === "edit"
              ? "Update Recipe"
              : "Create Recipe"}
        </button>

      </div>

    </form>
  );
}

export default RecipeForm;