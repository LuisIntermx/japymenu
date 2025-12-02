import { Schema, models, model } from "mongoose";

const orderSchema = new Schema({
  name: String,
  table: String,
  active: Boolean,
  sended: Boolean,
  createdAt: { type: Date, default: Date.now },
  finishedAt: Date,
  elements: [
    {
      name: String,
      category: String,
      quantity: String,
      price: Number,
      type: String,
      notes: String,
    },
  ],
});

export const Order = models.Order || model("Order", orderSchema);
