import express from 'express';
import {
  listProduct,
  createProduct,
  renderPageCreateProduct,
  renderPageUpdateProduct,
  updateProduct,
  renderPageDeleteProduct,
  deleteProduct
} from "../controller/productController.js";

const router = express.Router();

// List products
router.get('/', listProduct);

// Create product
router.get("/create", renderPageCreateProduct);
router.post("/create", createProduct);

// Update product
router.get("/update/:id", renderPageUpdateProduct);
router.post("/update/:id", updateProduct);

// Delete product
router.get("/delete/:id", renderPageDeleteProduct);
router.delete("/delete/:id", deleteProduct);  // Changed from POST to DELETE

export default router;