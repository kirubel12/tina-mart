import mongoose, {Schema, Document} from 'mongoose';

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    cartId: mongoose.Types.ObjectId;
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
        required: true,
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
    },
}, { timestamps: true });

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
