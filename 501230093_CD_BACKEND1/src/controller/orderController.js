import OrderModel from "../models/orderModel.js";  // Thêm .js vào
import ProductModel from "../models/productModel.js";  // Thêm .js vào
import { ObjectId } from "mongodb";


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
export async function listOrder(req, res) {
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

    const countOrders = await OrderModel.countDocuments(filters);
    const orders = await OrderModel.find(filters)
      
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    res.render("pages/orders/list", {
      title: "Orders",
      orders: orders,
      countPagination: Math.ceil(countOrders / pageSize),  // Changed from countProducts to countOrders
      pageSize,
      page,
      sort,
      sortObjects,
    });
  } catch (error) {
    console.error(error);
    res.send("Hiện không có order nào");
  }
}

export async function renderPageSimulateCreateProduct(req, res) {
      const products = await ProductModel.find({deletedAt:null})
  try {
    
    res.render("pages/orders/form", {
      title: "Create Orders",
      mode: "Create",
      order: {},
      products:products,
      err: {},
    });
  } catch (error) {
    console.error(error);
    res.send("Error loading create product page");
  }
}

export async function createOrder(req, res) {
  try {
    const { billingAddress, discount = 0, orderItems } = req.body;
    let subTotal = 0,
      total = 0;

    // Tìm và xử lý numericalOrder
    const lastOrder = await OrderModel.findOne({}, { numericalOrder: 1 }).sort({
      createdAt: -1,
    });
    const numericalOrder = lastOrder
      ? parseInt(lastOrder.numericalOrder || 0) + 1
      : 1;
    const orderNo = `order-${numericalOrder}`;

    // Tính tổng tiền
    if (orderItems && orderItems.length > 0) {
      for (let orderItem of orderItems) {
        subTotal += Number(orderItem.quantity) * Number(orderItem.price);
      }
    }

    // Tính giảm giá
    total = (subTotal * (100 - Number(discount || 0))) / 100;

    const rs = await OrderModel.create({
      orderNo,
      discount: Number(discount || 0),
      total: Number(total),
      status: "created",
      orderItems,
      numericalOrder: Number(numericalOrder),
      billingAddress,
      createdAt: new Date(),
    });
    res.json(rs);
  } catch (error) {
    console.warn(error);
    res.status(400).json({
      success: false,
      message: error.message || "Tạo đơn hàng không thành công",
    });
  }
}

// export async function renderPageUpdateProduct(req, res) {
//   try {
//     const { id } = req.params;
//     const [product, categories] = await Promise.all([
//       ProductModel.findOne({
//         _id: new ObjectId(id),
//         deletedAt: null,
//       }),
//       CategoryModel.find({ deletedAt: null })
//     ]);

//     if (product) {
//       res.render("pages/products/form", {
//         title: "Update Product",
//         mode: "Update",
//         product,
//         sizes,
//         colors,
//         categories,
//         err: {},
//       });
//     } else {
//       res.send("Không tìm thấy sản phẩm");
//     }
//   } catch (error) {
//     console.error(error);
//     res.send("Error loading update product page");
//   }
// }

// export async function updateProduct(req, res) {
//   const { ...data } = req.body;
//   const { id } = req.params;
  
//   try {
//     const existingProduct = await ProductModel.findOne({
//       code: data.code,
//       _id: { $ne: new ObjectId(id) },
//       deletedAt: null,
//     });

//     if (existingProduct) {
//       throw "code";
//     }

//     const productData = {
//       ...data,
//       active: data.active === "on" ? true : false,
//       images: data.image ? [data.image] : [],
//       searchString: removeVietnameseAccents(data.name),
//       updatedAt: new Date()
//     };

//     await ProductModel.updateOne(
//       { _id: new ObjectId(id) },
//       productData
//     );

//     res.redirect("/products");
//   } catch (error) {
//     console.error("error", error);
//     const categories = await CategoryModel.find({ deletedAt: null });
//     let err = {};
    
//     if (error === "code") {
//       err.code = "Mã sản phẩm này đã tồn tại";
//     }
//     if (error.name === "ValidationError") {
//       Object.keys(error.errors).forEach((key) => {
//         err[key] = error.errors[key].message;
//       });
//     }
    
//     res.render("pages/products/form", {
//       title: "Update Product",
//       mode: "Update",
//       product: { ...data, _id: id },
//       sizes,
//       colors,
//       categories,
//       err,
//     });
//   }
// }

// export async function renderPageDeleteProduct(req, res) {
//   try {
//     const { id } = req.params;
    
//     // Validate if id is a valid MongoDB ObjectId
//     if (!ObjectId.isValid(id)) {
//       return res.status(400).send("Invalid product ID format");
//     }

//     const product = await ProductModel.findOne({
//       _id: new ObjectId(id),
//       deletedAt: null,
//     });

//     if (product) {
//       res.render("pages/products/form", {
//         title: "Delete Product",
//         mode: "Delete",
//         product,
//         sizes,
//         colors,
//         err: {},
//       });
//     } else {
//       res.send("Không tìm thấy sản phẩm");
//     }
//   } catch (error) {
//     console.error(error);
//     res.send("Error loading delete product page");
//   }
// }

// export async function deleteProduct(req, res) {
//   try {
//     const { id } = req.params;
//     if (!ObjectId.isValid(id)) {
//       throw new Error("Invalid product ID format");
//     }

//     const result = await ProductModel.deleteOne({ _id: new ObjectId(id) });

//     if (result.deletedCount === 0) {
//       throw new Error("Product not found");
//     }

//     res.json({ success: true });
//   } catch (error) {
//     console.error("Delete error:", error);
//     res.status(400).json({ 
//       success: false, 
//       message: error.message || "Xóa sản phẩm không thành công" 
//     });
//   }
// }
