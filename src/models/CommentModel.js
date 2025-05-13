import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reportId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
        required: true,
    },
    text:{
        type: String,
        required: true,
    },
})

export default mongoose.model("Comment", commentSchema);