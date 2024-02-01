import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import Image from "./Image.js";
cloudinary.config({
  cloud_name: process.env.ClOUDINARY_CLOUD_NAME,
  api_key: process.env.ClOUDINARY_API_KEY,
  api_secret: process.env.ClOUDINARY_API_SECRET,
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();
dotenv.config();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.post("/upload", upload.single("image"), async (req, res) => {
  const fileBuffer = req.file.buffer;

  try {
    const uploadResult = await cloudinary.uploader
      .upload_stream({ resource_type: "auto" })
      .end(fileBuffer);

    // Create a new document using the Image model
    const image = new Image({
      url: uploadResult.secure_url,
      filename: uploadResult.original_filename,
    });

    // Save the document to MongoDB
    await image.save();

    // Return the uploaded image URL and saved document ID
    res.json({ url: uploadResult.secure_url, id: image._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});
// Connect to MongoDB database using Mongoose ORM
//mongoose.set("useFindAndModify", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("db connect");
    app.listen(4000, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log(err);
  });
