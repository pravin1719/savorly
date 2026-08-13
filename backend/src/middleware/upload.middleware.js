const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.resolve(
    process.env.UPLOAD_DIR || "uploads/recipes"
);

// Create upload directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true
    });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);

        const uniqueName = `recipe-${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${extension}`;

        cb(null, uniqueName);
    }
});

// Allowed image types
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error("Only JPEG, PNG and WEBP images are allowed")
        );
    }
};

// Multer configuration
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;