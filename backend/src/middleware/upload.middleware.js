const multer = require("multer");

// Store uploaded files temporarily in memory.
// They will be uploaded to Cloudinary from the service.
const storage = multer.memoryStorage();

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
            new Error(
                "Only JPEG, PNG and WEBP images are allowed"
            )
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