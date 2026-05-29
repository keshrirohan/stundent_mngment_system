import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    
    productList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            default: [],
        },
    ],
   
   



});


const User = mongoose.model("User", userSchema);

export default User;