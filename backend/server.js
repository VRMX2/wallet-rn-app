// ✅ Import required modules
import express from 'express';
import dotenv from 'dotenv';
import { sql } from "./config/db.js"; // Import Neon SQL connection

// ✅ Load environment variables from .env file
dotenv.config();

// ✅ Initialize Express app
const app = express();
const port = process.env.PORT || 9001;

// ✅ Middleware to parse incoming JSON requests
app.use(express.json());

// ✅ Optional middleware to log incoming requests (for debugging)
// app.use((req, res, next) => {
//   console.log("Request method:", req.method, "Path:", req.path);
//   next();
// });

/* ===============================
   DATABASE INITIALIZATION
   =============================== */
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `;
    console.log("✅ Table 'transactions' created or already exists.");
  } catch (error) {
    console.error("❌ Error creating table:", error);
    process.exit(1); // Stop server if DB setup fails
  }
}

/* ===============================
   ROUTES
   =============================== */

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("🚀 Server is up and running!");
});

// ✅ Create a new transaction
app.post("/api/transactions", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    // Validate required fields
    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Insert into database
    const result = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;

    console.log("✅ Transaction created:", result[0]);
    res.status(201).json(result[0]);
  } catch (error) {
    console.error("❌ Error creating the transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get all transactions for a specific user
app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId}
    `;

    res.status(200).json(transactions);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/transactions/summary/:userId", async (req, res) => {
	try{
		const {userId} = req.params;
		const balanceResult = await sql `SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}`
		const incomeResult = await sql `SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0`
		const expensesResult = await sql `SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0`


		res.status(200).json({
			balance: balanceResult[0].balance,
			income: incomeResult[0].income,
			expenses: expensesResult[0].expenses
		})
	}catch(error){
		console.log("error getting the summary", error);
		res.status(500).json({message: "internal server error"});
	}
})

// ✅ Delete a specific transaction by ID
app.delete("/api/transactions/:id", async (req, res) => {
	try {
	if(isNaN(parseInt(id))){
		return res.status(400).json({message :"invalid transaction id"});
	}
    const { id } = req.params;

    const deleted = await sql`
      DELETE FROM transactions
      WHERE id = ${id}
      RETURNING *
    `;

    // If transaction not found
	if (deleted.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
      deleted: deleted[0]
    });
  } catch (error) {
    console.error("❌ Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ===============================
   START SERVER
   =============================== */
initDB().then(() => {
  app.listen(port, () => {
    console.log(`🌐 Server is running on port ${port}`);
  });
});
