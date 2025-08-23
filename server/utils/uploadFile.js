import { v2 as cloudinary } from "cloudinary";


export const uploadFiles = async (filePath, resourceType = "image", folder = "") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: resourceType,
    });
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    throw new Error("Cloudinary upload failed: " + err.message);
  }
};
 

export const deleteFiles = async (imageUrl, resourceType = "image") => {
  try {
    
    const urlObj = new URL(imageUrl);
    const pathname = urlObj.pathname; 

    const afterUpload = pathname.includes("/upload/") ? pathname.split("/upload/")[1] : pathname.split("/").slice(-1)[0];

    const parts = afterUpload.split("/").filter(Boolean);
    if (parts[0] && /^v\d+$/.test(parts[0])) parts.shift();

    const publicIdWithExt = parts.join("/");
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); 

    if (!publicId) throw new Error("Could not resolve public_id from URL");

    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType,  invalidate: true });
  } catch (err) {
    throw new Error("Cloudinary deletion failed: " + err.message);
  }
};