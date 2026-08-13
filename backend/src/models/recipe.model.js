const mongoose = require("mongoose");

// ----------------------------------
// Ingredient Schema
// ----------------------------------
const ingredientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        quantity: {
            type: String,
            required: true,
            trim: true
        },

        unit: {
            type: String,
            required: true,
            trim: true
        },

        order: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        _id: false
    }
);

// ----------------------------------
// Cooking Step Schema
// ----------------------------------
const stepSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true
        },

        order: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        _id: false
    }
);

// ----------------------------------
// Recipe Image Schema
// ----------------------------------
const imageSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: true,
            trim: true
        },

        url: {
            type: String,
            required: true,
            trim: true
        },

        mimetype: {
            type: String,
            required: true,
            trim: true
        },

        size: {
            type: Number,
            required: true,
            min: 0
        },

        order: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        _id: false
    }
);

// ----------------------------------
// Recipe Schema
// ----------------------------------
const recipeSchema = new mongoose.Schema(
    {
        // -------------------------------
        // Basic Information
        // -------------------------------
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },

        preparationTime: {
            type: Number,
            required: true,
            min: 0
        },

        cookingTime: {
            type: Number,
            required: true,
            min: 0
        },

        servingSize: {
            type: Number,
            required: true,
            min: 1
        },

        cuisine: {
            type: String,
            required: true,
            trim: true
        },

        foodType: {
            type: String,
            required: true,
            enum: [
                "Vegetarian",
                "Non-Vegetarian",
                "Vegan",
                "Egg"
            ]
        },

        difficulty: {
            type: String,
            required: true,
            enum: [
                "Easy",
                "Medium",
                "Hard"
            ]
        },

        // -------------------------------
        // Rating
        // -------------------------------
        rating: {
            average: {
                type: Number,
                default: 0,
                min: 0,
                max: 5
            },

            count: {
                type: Number,
                default: 0,
                min: 0
            }
        },

        // -------------------------------
        // Recipe Images
        // -------------------------------
        images: {
            type: [imageSchema],
            default: []
        },

        // -------------------------------
        // Ingredients
        // -------------------------------
        ingredients: {
            type: [ingredientSchema],

            validate: {
                validator: function (ingredients) {
                    return ingredients.length > 0;
                },

                message: "At least one ingredient is required"
            }
        },

        // -------------------------------
        // Cooking Steps
        // -------------------------------
        steps: {
            type: [stepSchema],

            validate: {
                validator: function (steps) {
                    return steps.length > 0;
                },

                message: "At least one cooking step is required"
            }
        },

        // -------------------------------
        // Recipe Owner
        // -------------------------------
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },

    {
        timestamps: true
    }
);

// ----------------------------------
// Indexes
// ----------------------------------

recipeSchema.index({
    cuisine: 1
});

recipeSchema.index({
    difficulty: 1
});

recipeSchema.index({
    foodType: 1
});

recipeSchema.index({
    "rating.average": -1
});

recipeSchema.index({
    createdAt: -1
});

recipeSchema.index({
    createdBy: 1
});

// ----------------------------------
// Model
// ----------------------------------

const Recipe = mongoose.model(
    "Recipe",
    recipeSchema
);

module.exports = Recipe;