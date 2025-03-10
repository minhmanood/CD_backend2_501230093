import mongoose from "mongoose";
const { Schema } = mongoose;
const productSchema = new Schema({
    code: {
      type: String,
      required: [true, "Bắt buộc phải nhập mã sản phẩm"],
    },
    name: {
      required: [true, "Bắt buộc phải nhập tên sản phẩm"],
      type: String,
    },
    price: {
      required: [true, "Bắt buộc phải nhập giá sản phẩm"],
      type: Number,
    },
    // Sửa từ 'size' thành 'sizes'
    sizes: {
      type: [String],
      enum: ["S", "M", "L", "XL"],
    },
    // Sửa từ 'color' thành 'colors'
    colors: {
      type: [String],
      enum: ["red", "green", "blue", "yellow", "purple", "brown", "white", "black"],
    },
    active: Boolean,
    description: String,
    information: String,
    images: [String], 
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' }, 
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    searchString: {
      required: [true, "Bắt buộc phải nhập chuổi sản phẩm"],
      type: String,
    },
  },
  {
    versionKey: false,
    collection: "products",
  }
);

export default mongoose.model("Product", productSchema);
