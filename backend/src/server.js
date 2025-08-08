// server.js
import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import ratelimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';
import job from "./config/cron.js";

dotenv.config();
const app = express();

if (process.env.NODE_ENV === "production") job.start();

const port = process.env.PORT || 9001;

app.use(express.json());
app.use(ratelimiter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API routes
app.use("/api/transactions", transactionsRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

initDB().then(() => {
  app.listen(port, () => {
    console.log(`🌐 Server running on port ${port}`);
  });
});