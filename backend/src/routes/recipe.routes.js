const express = require("express");

const {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    uploadRecipeImages,
    deleteRecipeImage, rateRecipe
} = require("../controllers/recipe.controller");

const {
    recipeQueryValidator
} = require("../validators/recipe-query.validator");
const {
    createRecipeValidator,
    updateRecipeValidator
} = require("../validators/recipe.validator");

const validateRequest = require(
    "../middleware/validation.middleware"
);

const authMiddleware = require(
    "../middleware/auth.middleware"
);

const authorizeRecipeOwner = require(
    "../middleware/authorization.middleware"
);

const upload = require(
    "../middleware/upload.middleware"
);

const router = express.Router();


// =====================================================
// GET ALL RECIPES
// =====================================================

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Get all recipes
 *     description: Get recipes with pagination, search, filtering and sorting.
 *     tags:
 *       - Recipes
 *
 *     parameters:
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of recipes per page
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search recipe title or description
 *
 *       - in: query
 *         name: cuisine
 *         schema:
 *           type: string
 *         description: Filter recipes by cuisine
 *
 *       - in: query
 *         name: foodType
 *         schema:
 *           type: string
 *           enum:
 *             - Vegetarian
 *             - Non-Vegetarian
 *             - Vegan
 *             - Egg
 *         description: Filter by food type
 *
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum:
 *             - Easy
 *             - Medium
 *             - Hard
 *         description: Filter by difficulty
 *
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - createdAt
 *             - rating
 *             - title
 *             - preparationTime
 *             - cookingTime
 *           default: createdAt
 *         description: Field used for sorting
 *
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           default: desc
 *         description: Sort direction
 *
 *     responses:
 *       200:
 *         description: Recipes retrieved successfully
 */
router.get(
    "/",
    recipeQueryValidator,
    validateRequest,
    getAllRecipes
);


// =====================================================
// GET RECIPE BY ID
// =====================================================

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get recipe by ID
 *     tags:
 *       - Recipes
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *
 *     responses:
 *       200:
 *         description: Recipe retrieved successfully
 *
 *       404:
 *         description: Recipe not found
 */
router.get(
    "/:id",
    getRecipeById
);


// =====================================================
// CREATE RECIPE
// =====================================================

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags:
 *       - Recipes
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - preparationTime
 *               - cookingTime
 *               - servingSize
 *               - cuisine
 *               - foodType
 *               - difficulty
 *               - ingredients
 *               - steps
 *             properties:
 *               title:
 *                 type: string
 *                 example: Chicken Biryani
 *
 *               description:
 *                 type: string
 *                 example: Aromatic Indian chicken biryani
 *
 *               preparationTime:
 *                 type: integer
 *                 example: 20
 *
 *               cookingTime:
 *                 type: integer
 *                 example: 45
 *
 *               servingSize:
 *                 type: integer
 *                 example: 4
 *
 *               cuisine:
 *                 type: string
 *                 example: Indian
 *
 *               foodType:
 *                 type: string
 *                 enum:
 *                   - Vegetarian
 *                   - Non-Vegetarian
 *                   - Vegan
 *                   - Egg
 *
 *               difficulty:
 *                 type: string
 *                 enum:
 *                   - Easy
 *                   - Medium
 *                   - Hard
 *
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - quantity
 *                     - unit
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Chicken
 *                     quantity:
 *                       type: string
 *                       example: "500"
 *                     unit:
 *                       type: string
 *                       example: g
 *                     order:
 *                       type: integer
 *                       example: 1
 *
 *               steps:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - description
 *                   properties:
 *                     description:
 *                       type: string
 *                       example: Marinate the chicken
 *                     order:
 *                       type: integer
 *                       example: 1
 *
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *
 *       401:
 *         description: Authentication required
 *
 *       400:
 *         description: Validation failed
 */
router.post(
    "/",
    authMiddleware,
    createRecipeValidator,
    validateRequest,
    createRecipe
);


// =====================================================
// UPDATE RECIPE
// =====================================================

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: Update a recipe
 *     tags:
 *       - Recipes
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *
 *       401:
 *         description: Authentication required
 *
 *       403:
 *         description: Not authorized
 *
 *       404:
 *         description: Recipe not found
 */
router.put(
    "/:id",
    authMiddleware,
    authorizeRecipeOwner,
    updateRecipeValidator,
    validateRequest,
    updateRecipe
);


// =====================================================
// DELETE RECIPE
// =====================================================

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete a recipe
 *     tags:
 *       - Recipes
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *
 *       401:
 *         description: Authentication required
 *
 *       403:
 *         description: Not authorized
 *
 *       404:
 *         description: Recipe not found
 */
router.delete(
    "/:id",
    authMiddleware,
    authorizeRecipeOwner,
    deleteRecipe
);


// =====================================================
// UPLOAD RECIPE IMAGES
// =====================================================

/**
 * @swagger
 * /api/recipes/{id}/images:
 *   post:
 *     summary: Upload recipe images
 *     tags:
 *       - Recipes
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *
 *       400:
 *         description: Invalid image
 *
 *       401:
 *         description: Authentication required
 *
 *       403:
 *         description: Not authorized
 *
 *       404:
 *         description: Recipe not found
 */
router.post(
    "/:id/images",
    authMiddleware,
    authorizeRecipeOwner,
    upload.array("images", 5),
    uploadRecipeImages
);


// =====================================================
// DELETE RECIPE IMAGE
// =====================================================

/**
 * @swagger
 * /api/recipes/{id}/images/{filename}:
 *   delete:
 *     summary: Delete a recipe image
 *     tags:
 *       - Recipes
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *
 *       401:
 *         description: Authentication required
 *
 *       403:
 *         description: Not authorized
 *
 *       404:
 *         description: Recipe or image not found
 */
router.delete(
    "/:id/images/:filename",
    authMiddleware,
    authorizeRecipeOwner,
    deleteRecipeImage
);
/**
 * @swagger
 * /recipes/{id}/rating:
 *   post:
 *     summary: Rate a recipe
 *     description: Add a rating from 1 to 5 for a recipe
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Recipe ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       200:
 *         description: Recipe rated successfully
 *       400:
 *         description: Invalid rating
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 */
router.post(
    "/:id/rating",
    authMiddleware,
    rateRecipe
);

module.exports = router;