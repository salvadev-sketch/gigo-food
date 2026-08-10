import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import passwordRouter from "./routes/passwordRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import seedRouter from "./routes/seedRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean),
  })
);
app.use("/uploads", express.static("uploads"));

app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/password", passwordRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/seed", seedRouter);

app.get("/", (req, res) => {
  res.send("GIGO Food API is running");
});

// IMPORTANT: await the DB connection before listening — a health check
// responding does NOT mean MongoDB is actually connected.
const start = async () => {
  await connectDB();
  app.listen(port, () => console.log(`[server] GIGO Food API listening on port ${port}`));
};

start();
