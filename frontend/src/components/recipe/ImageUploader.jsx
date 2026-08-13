import { useEffect, useState } from "react";

function ImageUploader({
  images = [],
  onChange,
  maxImages = 5
}) {
  const [previews, setPreviews] = useState([]);

  // =========================================
  // CREATE PREVIEWS
  // =========================================

  useEffect(() => {
    const newPreviews = images.map((image) => {
      // Existing image from backend
      if (
        image &&
        typeof image === "object" &&
        image.url
      ) {
        const url = image.url.startsWith("http")
          ? image.url
          : `http://localhost:5000${image.url}`;

        return {
          type: "existing",
          url,
          original: image
        };
      }

      // Newly selected File
      if (image instanceof File) {
        return {
          type: "new",
          url: URL.createObjectURL(image),
          original: image
        };
      }

      return null;
    });

    setPreviews(
      newPreviews.filter(Boolean)
    );

    // Cleanup object URLs for newly selected files
    return () => {
      newPreviews.forEach((preview) => {
        if (
          preview?.type === "new" &&
          preview.url
        ) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [images]);

  // =========================================
  // SELECT NEW IMAGES
  // =========================================

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (!selectedFiles.length) {
      return;
    }

    const remainingSlots =
      maxImages - images.length;

    const filesToAdd =
      selectedFiles.slice(
        0,
        remainingSlots
      );

    onChange([
      ...images,
      ...filesToAdd
    ]);

    // Allow selecting same file again
    event.target.value = "";
  };

  // =========================================
  // REMOVE IMAGE
  // =========================================

  const handleRemove = (index) => {
    const updatedImages =
      images.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );

    onChange(updatedImages);
  };

  return (
    <div className="image-uploader">

      {/* =====================================
          IMAGE PREVIEWS
      ===================================== */}

      {previews.length > 0 && (
        <div className="image-preview-grid">

          {previews.map(
            (preview, index) => (
              <div
                className="image-preview-item"
                key={
                  preview.original?.filename ||
                  `${preview.type}-${index}`
                }
              >

                <img
                  src={preview.url}
                  alt={`Recipe ${index + 1}`}
                  className="image-preview"
                />

                <button
                  type="button"
                  className="remove-image-button"
                  onClick={() =>
                    handleRemove(index)
                  }
                >
                  ×
                </button>

                {preview.type ===
                  "existing" && (
                  <span className="existing-image-label">
                    Existing
                  </span>
                )}

              </div>
            )
          )}

        </div>
      )}

      {/* =====================================
          UPLOAD AREA
      ===================================== */}

      {images.length < maxImages && (
        <label className="image-upload-box">

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            hidden
          />

          <div className="upload-icon">
            +
          </div>

          <strong>
            Add Recipe Images
          </strong>

          <span>
            PNG, JPG, JPEG or WEBP
          </span>

          <small>
            {images.length} / {maxImages} images
          </small>

        </label>
      )}

    </div>
  );
}

export default ImageUploader;