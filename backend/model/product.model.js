import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  selling_price: {
    type: Number,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },
  imageUrl: [
    {
      type: String,
      required: true,
    },
  ],
  status: {
    type: String,
    enum: ["ordered", "delivered", "cancelled", "listed", "out of stock"],
    default: "listed",
  },
  stock: {
    type: Number,
    required: true,
    default: 1,
  },
  discount: {
    type: Number,
    calculate: () => {
      return ((this.mrp - this.selling_price) / this.mrp) * 100;
    },
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
});
