// ✅ server.js (main file)
import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import ratelimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 9001;

app.use(express.json());
app.use(ratelimiter);

app.get("/health", (req, res) => {
  res.send("🚀 Server is up and running!");
});

app.use("/api/transactions", transactionsRoute);



initDB().then(() => {
  app.listen(port, () => {
    console.log(`🌐 Server is running on port ${port}`);
  });
});
