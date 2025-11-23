import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import statusRoutes from "./routes/statusRoutes.js"




dotenv.config();
const app = express();

connectDB();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/stores",storeRoutes);
app.use("/api/status",
    
    statusRoutes)


// app.use("/api/auth", authRoutes);

// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/users", userRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});