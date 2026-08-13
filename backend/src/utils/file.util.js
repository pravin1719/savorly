const fs = require("fs/promises");
const path = require("path");

const deleteFile = async (filename) => {
    if (!filename) {
        return;
    }

    const uploadDirectory = path.resolve(
        process.env.UPLOAD_DIR || "uploads/recipes"
    );

    const filePath = path.join(uploadDirectory, filename);

    try {
        await fs.unlink(filePath);
    } catch (error) {
        // File already doesn't exist
        if (error.code === "ENOENT") {
            return;
        }

        throw error;
    }
};

module.exports = {
    deleteFile
};