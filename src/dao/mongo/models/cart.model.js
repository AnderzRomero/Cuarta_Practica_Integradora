import mongoose from "mongoose";

const collection = "carts";

const productSubSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
}, { _id: false });

const schema = new mongoose.Schema(
    {
        products: {
            type: [productSubSchema],
            default: [],
        },
    },
    { timestamps: true }
);

schema.pre(['find', 'findOne', 'findById'], function () {
    this.populate('products._id');
})


const cartModel = mongoose.model(collection, schema);

export default cartModel;

