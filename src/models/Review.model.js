import {Schema, model} from "mongoose";

const reviewSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      enum: [1, 2, 3, 4, 5],
    },
    comment: String,
  },
  { timestamps: true })

export const Review = model('Review', reviewSchema);
