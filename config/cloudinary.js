// backend/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// if (process.env.DEBUG) {
//   console.log('Cloudinary Config:', {
//     cloud_name: config.cloud_name ? 'Set' : 'Missing',
//     api_key: config.api_key ? 'Set' : 'Missing',
//     api_secret: config.api_secret ? 'Set' : 'Missing'
//   });
// }

cloudinary.config(config);

export default cloudinary;
