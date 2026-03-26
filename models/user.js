import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    img: {
        type: String, // URL or image path
        default: null
    },

    joinDate: {
        type: Date,
        default: Date.now
    },

    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

export default mongoose.model("User", userSchema);