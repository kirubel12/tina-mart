import {Schema, model} from "mongoose";

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number,
      },
    ],
    shippingAddress: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'Credit/Debit Card', 'PayPal'],
      default: 'Cash on Delivery',
    },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
  },
  { timestamps: true })

export const Order = model('Order', orderSchema);
