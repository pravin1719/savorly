const mongoose = require("mongoose");

const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    // -----------------------------
    // Mongoose Validation Error
    // -----------------------------
    if (err instanceof mongoose.Error.ValidationError) {
        const errors = Object.values(err.errors).map((error) => ({
            field: error.path,
            message: error.message
        }));

        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        });
    }

    // -----------------------------
    // Invalid MongoDB ObjectId
    // -----------------------------
    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({
            success: false,
            message: "Invalid recipe ID"
        });
    }

    // -----------------------------
    // Duplicate MongoDB Key
    // -----------------------------
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "Duplicate value already exists"
        });
    }

    // -----------------------------
    // Multer Errors
    // -----------------------------
    if (err.name === "MulterError") {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "Image size cannot exceed 5MB"
            });
        }

        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                success: false,
                message: "Maximum 5 images are allowed"
            });
        }

        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // -----------------------------
    // Custom Application Errors
    // -----------------------------
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // -----------------------------
    // Unknown Error
    // -----------------------------
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};

module.exports = errorMiddleware;