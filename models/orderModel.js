// Schema สำหรับ Order

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  
 'products', // Assuming your Product model name is 'products'
        required: true // Ensure product ID is always provided
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1 // Validate quantity to be at least 1
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true, // Ensure total price is always provided
    validate: { // Optional validation for non-negative total price
      validator: (value) => value >= 0,
      message: 'Total price must be a non-negative number'
    }
  },
  // ... Other relevant Order fields (e.g., user, status, createdAt, updatedAt)
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;