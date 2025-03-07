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

const orderSchema = new Schema({
    orderNo: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['created', 'completed', 'cancelled'],
        default: 'created'
    },
    orderItems: [orderItemSchema],
    total: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    versionKey: false,
    collection: "orders",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;