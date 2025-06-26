import {Schema, model} from "mongoose";

const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    id: { type: String, unique: true },
    total_amount : { type: Number, default: 0 },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true })

// Calculate total_amount before saving
cartSchema.pre('save', async function(next) {
  if (!this.isModified('items')) return next();
  const Product = this.model('Product');
  let total = 0;
  for (const item of this.items) {
    if (item.product && item.quantity > 0) {
      const product = await Product.findById(item.product);
      if (product) {
        total += product.price * item.quantity;
      }
    }
  }
  // Format total_amount to two decimal places
  this.total_amount = Number(total.toFixed(2));
  next();
});

export const Cart = model('Cart', cartSchema);
