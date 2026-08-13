const Recipe = require("../models/recipe.model");
const { deleteFile } = require("../utils/file.util");

/* =========================================
   NORMALIZE ARRAY ORDER
========================================= */

const normalizeOrder = (items = []) => {
    return items.map((item, index) => ({
        ...item,
        order: index + 1
    }));
};

/* =========================================
   CREATE RECIPE
========================================= */

const createRecipe = async (
    recipeData,
    userId
) => {
    const recipe = await Recipe.create({
        ...recipeData,

        createdBy: userId,

        ingredients: normalizeOrder(
            recipeData.ingredients
        ),

        steps: normalizeOrder(
            recipeData.steps
        )
    });

    return recipe;
};

/* =========================================
   GET ALL RECIPES
========================================= */

const getAllRecipes = async (
    queryParams
) => {
    const {
        page = 1,
        limit = 10,
        search,
        cuisine,
        foodType,
        difficulty,
        sortBy = "createdAt",
        sortOrder = "desc"
    } = queryParams;

    const pageNumber = Math.max(
        Number(page),
        1
    );

    const limitNumber = Math.min(
        Math.max(Number(limit), 1),
        100
    );

    const skip =
        (pageNumber - 1) *
        limitNumber;

    /* =====================================
       BUILD FILTER
    ===================================== */

    const filter = {};

    if (search) {
        filter.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    if (cuisine) {
        filter.cuisine = cuisine;
    }

    if (foodType) {
        filter.foodType = foodType;
    }

    if (difficulty) {
        filter.difficulty = difficulty;
    }

    /* =====================================
       SORTING
    ===================================== */

    const allowedSortFields = [
        "createdAt",
        "rating",
        "title",
        "preparationTime",
        "cookingTime"
    ];

    const selectedSortField =
        allowedSortFields.includes(sortBy)
            ? sortBy
            : "createdAt";

    const sortDirection =
        String(sortOrder).toLowerCase() ===
            "asc"
            ? 1
            : -1;

    const sort = {};

    if (
        selectedSortField ===
        "rating"
    ) {
        sort["rating.average"] =
            sortDirection;
    } else {
        sort[selectedSortField] =
            sortDirection;
    }

    /* =====================================
       DATABASE QUERY
    ===================================== */

    const [
        recipes,
        totalRecipes
    ] = await Promise.all([
        Recipe.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNumber)
            .lean(),

        Recipe.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(
        totalRecipes /
        limitNumber
    );

    return {
        recipes,

        pagination: {
            currentPage: pageNumber,
            limit: limitNumber,
            totalRecipes,
            totalPages,
            hasNextPage:
                pageNumber <
                totalPages,
            hasPreviousPage:
                pageNumber > 1
        }
    };
};

/* =========================================
   GET RECIPE BY ID
========================================= */

const getRecipeById = async (
    recipeId
) => {
    const recipe =
        await Recipe.findById(
            recipeId
        );

    if (!recipe) {
        const error = new Error(
            "Recipe not found"
        );

        error.statusCode = 404;

        throw error;
    }

    return recipe;
};

/* =========================================
   UPDATE RECIPE
========================================= */

const updateRecipe = async (
    recipeId,
    recipeData
) => {
    const updateData = {
        ...recipeData
    };

    if (recipeData.ingredients) {
        updateData.ingredients =
            normalizeOrder(
                recipeData.ingredients
            );
    }

    if (recipeData.steps) {
        updateData.steps =
            normalizeOrder(
                recipeData.steps
            );
    }

    const recipe =
        await Recipe.findByIdAndUpdate(
            recipeId,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

    if (!recipe) {
        const error = new Error(
            "Recipe not found"
        );

        error.statusCode = 404;

        throw error;
    }

    return recipe;
};

/* =========================================
   DELETE RECIPE
========================================= */

const deleteRecipe = async (
    recipeId
) => {
    const recipe =
        await Recipe.findById(
            recipeId
        );

    if (!recipe) {
        const error = new Error(
            "Recipe not found"
        );

        error.statusCode = 404;

        throw error;
    }

    /* Delete physical image files */

    if (
        recipe.images &&
        recipe.images.length > 0
    ) {
        for (const image of recipe.images) {
            await deleteFile(
                image.filename
            );
        }
    }

    /* Delete recipe */

    await Recipe.findByIdAndDelete(
        recipeId
    );

    return true;
};

/* =========================================
   UPLOAD RECIPE IMAGES
========================================= */

const uploadRecipeImages = async (
    recipeId,
    files
) => {
    const recipe =
        await Recipe.findById(
            recipeId
        );

    /* Recipe doesn't exist */

    if (!recipe) {
        if (
            files &&
            files.length > 0
        ) {
            for (const file of files) {
                await deleteFile(
                    file.filename
                );
            }
        }

        const error = new Error(
            "Recipe not found"
        );

        error.statusCode = 404;

        throw error;
    }

    /* No files */

    if (
        !files ||
        files.length === 0
    ) {
        const error = new Error(
            "At least one image is required"
        );

        error.statusCode = 400;

        throw error;
    }

    const startingOrder =
        recipe.images.length + 1;

    const newImages =
        files.map(
            (file, index) => ({
                filename:
                    file.filename,

                url:
                    `/uploads/recipes/${file.filename}`,

                mimetype:
                    file.mimetype,

                size:
                    file.size,

                order:
                    startingOrder +
                    index
            })
        );

    recipe.images.push(
        ...newImages
    );

    await recipe.save();

    return recipe;
};

/* =========================================
   DELETE RECIPE IMAGE
========================================= */

const deleteRecipeImage = async (
    recipeId,
    filename
) => {
    const recipe =
        await Recipe.findById(
            recipeId
        );

    if (!recipe) {
        const error = new Error(
            "Recipe not found"
        );

        error.statusCode = 404;

        throw error;
    }

    const imageIndex =
        recipe.images.findIndex(
            (image) =>
                image.filename ===
                filename
        );

    if (imageIndex === -1) {
        const error = new Error(
            "Recipe image not found"
        );

        error.statusCode = 404;

        throw error;
    }

    const image =
        recipe.images[imageIndex];

    /* Delete physical file */

    await deleteFile(
        image.filename
    );

    /* Remove image */

    recipe.images.splice(
        imageIndex,
        1
    );

    /* Reorder remaining images */

    recipe.images.forEach(
        (image, index) => {
            image.order =
                index + 1;
        }
    );

    await recipe.save();

    return recipe;
};

/* =========================================
   RATE RECIPE
========================================= */

const rateRecipe = async (
    recipeId,
    rating
) => {
    const recipe =
        await Recipe.findById(
            recipeId
        );

    if (!recipe) {
        const error = new Error(
            "Recipe not found"
        );

        error.statusCode = 404;

        throw error;
    }

    const oldAverage =
        recipe.rating?.average ||
        0;

    const oldCount =
        recipe.rating?.count ||
        0;

    const newCount =
        oldCount + 1;

    const newAverage =
        (
            oldAverage *
            oldCount +
            rating
        ) / newCount;

    recipe.rating.average =
        Number(
            newAverage.toFixed(1)
        );

    recipe.rating.count =
        newCount;

    await recipe.save();

    return recipe.rating;
};

/* =========================================
   EXPORTS
========================================= */

module.exports = {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    uploadRecipeImages,
    deleteRecipeImage,
    rateRecipe
};