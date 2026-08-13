const express = require("express");

const {
    register,
    login
} = require("../controllers/auth.controller");

const router = express.Router();

// =====================================================
// REGISTER
// =====================================================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account.
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *
 *       409:
 *         description: Email already registered
 *
 *       400:
 *         description: Validation failed
 */
router.post(
    "/register",
    register
);


// =====================================================
// LOGIN
// =====================================================

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate a user and return a JWT token.
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *
 *     responses:
 *       200:
 *         description: Login successful
 *
 *       401:
 *         description: Invalid email or password
 *
 *       400:
 *         description: Validation failed
 */
router.post(
    "/login",
    login
);



module.exports = router;