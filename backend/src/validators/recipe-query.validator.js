const { query } = require("express-validator");

const recipeQueryValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),

    query("search")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Search cannot exceed 100 characters"),

    query("cuisine")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Cuisine cannot exceed 100 characters"),

    query("foodType")
        .optional()
        .isIn([
            "Vegetarian",
            "Non-Vegetarian",
            "Vegan",
            "Egg"
        ])
        .withMessage("Invalid food type"),

    query("difficulty")
        .optional()
        .isIn([
            "Easy",
            "Medium",
            "Hard"
        ])
        .withMessage("Invalid difficulty level"),

    query("sortBy")
        .optional()
        .isIn([
            "createdAt",
            "rating",
            "title",
            "preparationTime",
            "cookingTime"
        ])
        .withMessage("Invalid sort field"),

    query("sortOrder")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("Sort order must be either asc or desc")
];

module.exports = {
    recipeQueryValidator
};