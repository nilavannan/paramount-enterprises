import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity:    { type: Number, required: true },
  unitPrice:   { type: Number, required: true },
  subtotal:    { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    items:        [orderItemSchema],
    totalAmount:  { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);