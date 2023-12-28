import mongoose from "mongoose";

const collection = "Users";

const schema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        age: Number,
        password: String,
        role:
        {
            type: String,
            enum: ['user', 'premium', 'admin'],
            default: 'user'
        },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'cart'
        },
        active: {
            type: Boolean,
            default: true,
        },
        last_connection: {
            type: Date,
            default: new Date().toISOString(),
        },
    },
    {
        timestamps: true,
    }
)

const userModel = mongoose.model(collection, schema);

export default userModel;