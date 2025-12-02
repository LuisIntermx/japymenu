import { Schema, models, model } from "mongoose";

const PaymentSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  amount: { type: Number, required: true },
  tip: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Payment = models.Payment || model("Payment", PaymentSchema);
