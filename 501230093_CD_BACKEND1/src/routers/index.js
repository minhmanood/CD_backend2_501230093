import categoryRoute from './categoryRoute.js'

import CategoryModel from '../models/categoryModel.js'
import ProductModel from '../models/productModel.js'
import express from "express";
import productRoute from "./productRoute.js";  // Chỉ giữ lại một import
import orderRoute from "./orderRoute.js";

const routers = (app) => {
    app.use("/products", productRoute);
    app.use("/orders", orderRoute);
    app.use("/categories", categoryRoute);

    // Home page route
    app.get("/", async (req, res) => {
        try {
            const [categories, products] = await Promise.all([
                CategoryModel.find({ deletedAt: null }),
                ProductModel.find({ deletedAt: null })
            ]);
            
            res.render("pages/index", { 
                title: "Home",
                categories,
                products
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error loading home page");
        }
    });
};

export default routers;