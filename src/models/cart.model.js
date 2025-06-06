import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products" }, 
      quantity: { type: Number, default:1, required:true}
    }
  ],
  total: Number
});


export const CartModel = mongoose.model("carts", cartSchema); 