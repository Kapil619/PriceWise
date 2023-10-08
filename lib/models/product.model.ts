import { timeStamp } from "console";
import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },

    title: { type: String, required: true },

    image: { type: String, required: true, },

    currency: { type: String, required: true, },
    currentprice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    priceHistory: [
        {
            price: { type: Number, required: true },
            date: { type: Date, default: Date.now }
        }
    ],
    lowestPrice: { type: Number },
    highestPrice: { type: Number },
    averagePrice: { type: Number },
    discountPrice: { type: Number },
    category: { type: String },
    reviewsCount: { type: Number },
    isOutOfStock: { type: Boolean, default: false },
    users: [
        { email: { type: String, required: true, unique: true } }
    ], default: []
},
    { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;