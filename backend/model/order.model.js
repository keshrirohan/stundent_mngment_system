import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ["ordered", "delivered", "cancelled", "listed"],
        default: "listed",
      },
      paymentMode: {
        type: String,
        enum: ["COD", "Online"],
        default: "COD",
      },
      paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
      },
      orderDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.model("Order", orderSchema);
