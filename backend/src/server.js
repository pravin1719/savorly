const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const connectDB = require("./config/db");

const recipeRoutes = require("./routes/recipe.routes");
const authRoutes = require("./routes/auth.routes");

const errorMiddleware = require("./middleware/error.middleware");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "../uploads")
    )
);

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Recipe API is running"
    });
});

app.use("/api/recipes", recipeRoutes);

app.use("/api/auth", authRoutes);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// IMPORTANT: error middleware must be last
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});