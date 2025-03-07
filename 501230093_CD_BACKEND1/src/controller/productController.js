import ProductModel from "../models/productModel.js";
import CategoryModel from "../models/categoryModel.js";
import { ObjectId } from "mongodb";
import { removeVietnameseAccents } from "../common/index.js";

const sortObjects = [
  { code: "name_DESC", name: "Tên giảm dần" },
  { code: "name_ASC", name: "Tên tăng dần" },
  { code: "code_DESC", name: "Mã giảm dần" },
  { code: "code_ASC", name: "Mã tăng dần" },
  { code: "price_DESC", name: "Giá giảm dần" },
  { code: "price_ASC", name: "Giá tăng dần" }
];
const sizes=["S","M","L","XL"]
const colors=["red","green","blue","yellow","purple","brown","white","black"]
export async function listProduct(req, res) {
  try {
    const search = req.query?.search;
    const pageSize = !!req.query.pageSize ? parseInt(req.query.pageSize) : 5;
    const page = !!req.query.page ? parseInt(req.query.page) : 1;
    const skip = (page - 1) * pageSize;
    let sort = !!req.query.sort ? req.query.sort : null;

    let filters = {
      deletedAt: null,
    };

    if (search && search.length > 0) {
      filters.searchString = {
        $regex: removeVietnameseAccents(search),
        $options: "i",
      };
    }

    if (!sort) {
      sort = { _id: -1 }; // Changed from createdAt: -1 to _id: -1
    } else {
      const sortArray = sort.split("_");
      sort = { [sortArray[0]]: sortArray[1] === "ASC" ? 1 : -1 };
    }

    const countProducts = await ProductModel.countDocuments(filters);
    const products = await ProductModel.find(filters)
      .populate('categoryId')  // Add this line to populate category data
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    res.render("pages/products/list", {
      title: "Products",
      products: products,
      countPagination: Math.ceil(countProducts / pageSize),
      pageSize,
      page,
      sort,
      sortObjects,
    });
  } catch (error) {
    console.error(error);
    res.send("Error loading products");
  }
}

export async function renderPageCreateProduct(req, res) {
  const categories=await CategoryModel.find({deletedAt:null})
  try {
    
    res.render("pages/products/form", {
      title: "Create Product",
      mode: "Create",
      product: {},
      sizes,
      colors,
      categories:categories,
      err: {},
    });
  } catch (error) {
    console.error(error);
    res.send("Error loading create product page");
  }
}

export const createProduct = async (req, res) => {
    try {
        const productData = {
            ...req.body,
            active: req.body.active === "on" ? true : false,
            images: req.body.image ? [req.body.image] : [],
            searchString: removeVietnameseAccents(req.body.name)
        };
        
        await ProductModel.create(productData);
        res.redirect("/products");
    } catch (error) {
        console.warn(error);
        const categories = await CategoryModel.find({ deletedAt: null });
        res.render("pages/products/form", {
            title: "Create Product",
            mode: "Create",
            product: req.body,
            sizes,
            colors,
            categories,
            err: {
                message: error.message
            }
        });
    }
};

export async function renderPageUpdateProduct(req, res) {
  try {
    const { id } = req.params;
    const [product, categories] = await Promise.all([
      ProductModel.findOne({
        _id: new ObjectId(id),
        deletedAt: null,
      }),
      CategoryModel.find({ deletedAt: null })
    ]);

    if (product) {
      res.render("pages/products/form", {
        title: "Update Product",
        mode: "Update",
        product,
        sizes,
        colors,
        categories,
        err: {},
      });
    } else {
      res.send("Không tìm thấy sản phẩm");
    }
  } catch (error) {
    console.error(error);
    res.send("Error loading update product page");
  }
}

export async function updateProduct(req, res) {
  const { ...data } = req.body;
  const { id } = req.params;
  
  try {
    const existingProduct = await ProductModel.findOne({
      code: data.code,
      _id: { $ne: new ObjectId(id) },
      deletedAt: null,
    });

    if (existingProduct) {
      throw "code";
    }

    const productData = {
      ...data,
      active: data.active === "on" ? true : false,
      images: data.image ? [data.image] : [],
      searchString: removeVietnameseAccents(data.name),
      updatedAt: new Date()
    };

    await ProductModel.updateOne(
      { _id: new ObjectId(id) },
      productData
    );

    res.redirect("/products");
  } catch (error) {
    console.error("error", error);
    const categories = await CategoryModel.find({ deletedAt: null });
    let err = {};
    
    if (error === "code") {
      err.code = "Mã sản phẩm này đã tồn tại";
    }
    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
    }
    
    res.render("pages/products/form", {
      title: "Update Product",
      mode: "Update",
      product: { ...data, _id: id },
      sizes,
      colors,
      categories,
      err,
    });
  }
}

export async function renderPageDeleteProduct(req, res) {
  try {
    const { id } = req.params;
    
    // Validate if id is a valid MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid product ID format");
    }

    const product = await ProductModel.findOne({
      _id: new ObjectId(id),
      deletedAt: null,
    });

    if (product) {
      res.render("pages/products/form", {
        title: "Delete Product",
        mode: "Delete",
        product,
        sizes,
        colors,
        err: {},
      });
    } else {
      res.send("Không tìm thấy sản phẩm");
    }
  } catch (error) {
    console.error(error);
    res.send("Error loading delete product page");
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid product ID format");
    }

    const result = await ProductModel.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new Error("Product not found");
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(400).json({ 
      success: false, 
      message: error.message || "Xóa sản phẩm không thành công" 
    });
  }
}
