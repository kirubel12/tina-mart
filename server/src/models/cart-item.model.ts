import mongoose, {Schema, Document} from "mongoose";


export interface ICartItem extends Document {
    cartId?: string;
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
};

const cartItemSchema = new Schema<ICartItem>({
    cartId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const CartItem = mongoose.model<ICartItem>('CartItem', cartItemSchema);
export default CartItem;

