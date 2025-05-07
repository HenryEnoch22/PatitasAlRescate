import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    birthdate:{
        type: Date,
        required: false,
    },
    phone:{
        type: String,
        required: false,
    },
    password:{
        type: String,
        required: true,
    },
    profilePhoto:{
        type: String,
        required: false,
    },
}, {timestamps: true});

export default mongoose.model("User", userSchema);