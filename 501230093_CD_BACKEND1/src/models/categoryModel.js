import mongoose from "mongoose";
const { Schema } = mongoose;
const categorySchema = new Schema(
  {
    code: {
      
      type: String,
      required: [true, "Bắt buộc phải nhập mã sản phẩm"],

      minlength: [5, "mã sản phẩm phải có độ dài từ 5-10 kí tự"],
      maxlength: [10, "mã sản phẩm phải có độ dài từ 5-10 kí tự"],
      
      // to prevent creation of index for deleted documents
    },
    name: {
      required: [true, "Bắt buộc phải nhập tên sản phẩm"],
      type: String,
    },
    image: {
      required: [true, "Bắt buộc phải nhập link sản phẩm"],
      type: String,
    },
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
    collection: "categories",
  }
);

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;
