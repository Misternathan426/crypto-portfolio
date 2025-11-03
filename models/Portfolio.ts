import mongoose, { Schema, model, models } from "mongoose";

const portfolioSchema = new Schema({
    symbol: { type: String, required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
},
{ timestamps: true }
);

export default models.Portfolio || model("Portfolio", portfolioSchema);