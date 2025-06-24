import { Schema, model } from "mongoose";
import slugify from "slugify";
const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true

    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
    
}, {
    timestamps: true
})

categorySchema.pre("validate", function (next) {
    if (this.name && !this.slug) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true
        })
    }
    next();
})

export const Category = model("Category", categorySchema);

