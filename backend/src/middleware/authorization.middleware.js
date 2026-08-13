const Recipe = require("../models/recipe.model");

const authorizeRecipeOwner = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found"
            });
        }

        // Admin can modify any recipe
        if (req.user.role === "admin") {
            req.recipe = recipe;
            return next();
        }

        // Recipe owner can modify their own recipe
        if (recipe.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to modify this recipe"
            });
        }

        req.recipe = recipe;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authorizeRecipeOwner;