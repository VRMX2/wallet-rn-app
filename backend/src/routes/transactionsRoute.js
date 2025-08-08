// routes/transactionsRoute.js
import express from 'express';
import {
  getTransactionsByUserId,
  createTransaction,
  getSummary,
  deleteTransactionById
} from '../controllers/transactionsController.js';

const router = express.Router();

router.get('/user/:userId', getTransactionsByUserId);
router.post('/', createTransaction);
router.get('/summary/:userId', getSummary);
router.delete('/:id', deleteTransactionById);

export default router;