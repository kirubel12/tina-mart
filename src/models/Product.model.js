import {Schema, model} from "mongoose";

const productSchema = new Schema(  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    category: { type: String },
    image: String,
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true })

export const Product = model('Product', productSchema);
