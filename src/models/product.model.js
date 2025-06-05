import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
   title: String,
   description: String,
   code: Number,
   price: Number,
   status: Boolean,
   stock:Number,
   category:String,
   thumbnails: [],
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model("products", productSchema); 