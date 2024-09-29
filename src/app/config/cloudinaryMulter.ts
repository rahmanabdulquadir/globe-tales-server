import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloud";
import multer from "multer";

const storage = new CloudinaryStorage({
    cloudinary
})

export const multerUpload = multer({ storage })