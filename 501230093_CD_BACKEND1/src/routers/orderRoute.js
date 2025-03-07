import express from 'express';
import { listOrder, createOrder } from "../controller/orderController.js";

const router = express.Router();

// List orders
router.get('/', listOrder);

// Create order
router.post("/create", createOrder);

export default router;