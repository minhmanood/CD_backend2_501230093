import express from 'express';
import {
  listOrder,
  createOrder,
  renderPageSimulateCreateProduct,
} from "../controller/orderController.js";

const router = express.Router();

// List orders
router.get('/', listOrder);

// Create order
router.get("/create", renderPageSimulateCreateProduct);
router.post("/create", createOrder);

export default router;