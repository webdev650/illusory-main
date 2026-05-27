import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "illusory-uploads",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  } as any,
});

const upload = multer({ storage: storage });

export default upload;
