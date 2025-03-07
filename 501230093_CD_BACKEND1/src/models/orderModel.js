import mongoose from "mongoose";
const { Schema } = mongoose;

const orderItemSchema = new Schema(
    {
        productName: String,
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: Number,
        price: Number,
        total: Number
    },
    { versionKey: false }
);
const billingAdressSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Vui lòng nhập tên người nhận'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Vui lòng nhập email'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
        },
        phoneNumber: {
            type: String,
            required: [true, 'Vui lòng nhập số điện thoại'],
            match: [/^[0-9]{10}$/, 'Số điện thoại không hợp lệ']
        },
        address: {
            type: String,
            required: [true, 'Vui lòng nhập địa chỉ'],
            trim: true
        },
        district: {
            type: String,
            required: [true, 'Vui lòng nhập quận/huyện'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'Vui lòng nhập thành phố'],
            trim: true
        }
    },
    { versionKey: false }
);
const orderSchema = new Schema(
  {
    orderNo: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["created", "completed", "cancelled", "delivering"],
      default: "created",
    },
    orderItems: [orderItemSchema],
    total: {
      type: Number,
      required: [true, "Bắt buộc phải có sản phẩm trong đơn hàng "],
    },
    billingAddress: {
      type: billingAdressSchema,
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Giảm giá không thể âm"],
      max: [80, "Giảm giá không thể vượt quá 80%"],
      validate: {
        validator: function (value) {
          return value >= 0 && value <= 80;
        },
        message: "Giảm giá phải nằm trong khoảng 0-80%",
      },
    },
    numericalOrder: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    collection: "orders",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;