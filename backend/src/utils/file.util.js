const cloudinary = require("../config/cloudinary");

const deleteFile = async (publicId) => {
    if (!publicId) {
        return;
    }

    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error(
            "Cloudinary delete error:",
            error
        );

        throw error;
    }
};

module.exports = {
    deleteFile
};