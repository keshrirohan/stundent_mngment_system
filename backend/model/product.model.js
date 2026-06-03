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
  reviews: Number,
  mrp: {
    type: Number,
    required: true,
  },
  isInStock: {
    type: Boolean,
    default: true,
  },
  imageUrl: [
    {
      type: String,
      required: true,
    },
  ],

  stock: {
    type: Number,
    required: true,
    default: 1,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
