const { body } = require("express-validator");

const createRecipeValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Recipe title is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Recipe description is required"),

    body("preparationTime")
        .isInt({ min: 0 })
        .withMessage("Preparation time must be a non-negative number"),

    body("cookingTime")
        .isInt({ min: 0 })
        .withMessage("Cooking time must be a non-negative number"),

    body("servingSize")
        .isInt({ min: 1 })
        .withMessage("Serving size must be at least 1"),

    body("cuisine")
        .trim()
        .notEmpty()
        .withMessage("Cuisine is required"),

    body("foodType")
        .isIn(["Vegetarian", "Non-Vegetarian", "Vegan", "Egg"])
        .withMessage("Invalid food type"),

    body("difficulty")
        .isIn(["Easy", "Medium", "Hard"])
        .withMessage("Invalid difficulty level"),

    body("ingredients")
        .isArray({ min: 1 })
        .withMessage("At least one ingredient is required"),

    body("steps")
        .isArray({ min: 1 })
        .withMessage("At least one cooking step is required")
];

const updateRecipeValidator = [
    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Recipe title cannot be empty"),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Recipe description cannot be empty"),

    body("preparationTime")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Preparation time must be a non-negative number"),

    body("cookingTime")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Cooking time must be a non-negative number"),

    body("servingSize")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Serving size must be at least 1"),

    body("cuisine")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Cuisine cannot be empty"),

    body("foodType")
        .optional()
        .isIn(["Vegetarian", "Non-Vegetarian", "Vegan", "Egg"])
        .withMessage("Invalid food type"),

    body("difficulty")
        .optional()
        .isIn(["Easy", "Medium", "Hard"])
        .withMessage("Invalid difficulty level"),

    body("rating.average")
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage("Rating must be between 0 and 5"),

    body("rating.count")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Rating count cannot be negative"),

    body("ingredients")
        .optional()
        .isArray()
        .withMessage("Ingredients must be an array"),

    body("steps")
        .optional()
        .isArray()
        .withMessage("Steps must be an array")
];

module.exports = {
    createRecipeValidator,
    updateRecipeValidator
};

