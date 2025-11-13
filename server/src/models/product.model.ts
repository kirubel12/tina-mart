import mongoose, {Schema, Document} from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    inventory: number;
    images: string[];
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}



const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: 0,
    },
    category: {
        type: String,
        required: [true, "Product category is required"],
        trim: true,
    },
    inventory: {
        type: Number,
        required: [true, "Product inventory is required"],
        min: 0,
    },
    images: {
        type: [String],
        default: [],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }

}, {timestamps: true});

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;