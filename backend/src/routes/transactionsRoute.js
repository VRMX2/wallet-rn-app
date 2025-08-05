import express from 'express';
import {
  getTransactionsByUserId,
  createTransaction,
  getSummary,
  getAllTransactionsForUser,
  deleteTransactionById
} from '../controllers/transactionsController.js';

const router = express.Router();

router.get("/:userId", getAllTransactionsForUser);
router.get("/summary/:userId", getSummary);
router.post("/", createTransaction);
router.delete("/:id", deleteTransactionById);

export default router;