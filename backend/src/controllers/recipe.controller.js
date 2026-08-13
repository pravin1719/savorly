const recipeService = require("../services/recipe.service");

const createRecipe = async (req, res, next) => {
    try {
        const recipe = await recipeService.createRecipe(
            req.body,
            req.user.userId
        );

        return res.status(201).json({
            success: true,
            message: "Recipe created successfully",
            data: recipe
        });
    } catch (error) {
        next(error);
    }
};

const getAllRecipes = async (req, res, next) => {
    try {
        const result =
            await recipeService.getAllRecipes(req.query);

        return res.status(200).json({
            success: true,
            data: result.recipes,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

const getRecipeById = async (req, res, next) => {
    try {
        const recipe =
            await recipeService.getRecipeById(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            message: "Recipe fetched successfully",
            data: recipe
        });
    } catch (error) {
        next(error);
    }
};

const updateRecipe = async (req, res, next) => {
    try {
        const recipe =
            await recipeService.updateRecipe(
                req.params.id,
                req.body
            );

        return res.status(200).json({
            success: true,
            message: "Recipe updated successfully",
            data: recipe
        });
    } catch (error) {
        next(error);
    }
};

const deleteRecipe = async (req, res, next) => {
    try {
        await recipeService.deleteRecipe(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Recipe deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

/* =========================================
   RATE RECIPE
========================================= */

const rateRecipe = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;

        const numericRating = Number(rating);

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Rating must be between 1 and 5"
            });
        }

        const result =
            await recipeService.rateRecipe(
                id,
                numericRating
            );

        return res.status(200).json({
            success: true,
            message:
                "Recipe rated successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/* =========================================
   UPLOAD RECIPE IMAGES
========================================= */

const uploadRecipeImages = async (
    req,
    res,
    next
) => {
    try {
        const recipe =
            await recipeService.uploadRecipeImages(
                req.params.id,
                req.files
            );

        return res.status(200).json({
            success: true,
            message:
                "Recipe images uploaded successfully",
            data: recipe
        });
    } catch (error) {
        next(error);
    }
};

/* =========================================
   DELETE RECIPE IMAGE
========================================= */

const deleteRecipeImage = async (
    req,
    res,
    next
) => {
    try {
        const recipe =
            await recipeService.deleteRecipeImage(
                req.params.id,
                req.params.filename
            );

        return res.status(200).json({
            success: true,
            message:
                "Recipe image deleted successfully",
            data: recipe
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    rateRecipe,
    uploadRecipeImages,
    deleteRecipeImage
};