import mongoose from "mongoose";

const catagoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
},{timestamps: true});

const Catagories = mongoose.model("Catagories", catagoriesSchema);

export default Catagories;