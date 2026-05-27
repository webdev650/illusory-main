import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import apiRoutes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Illusory Design Studios API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
