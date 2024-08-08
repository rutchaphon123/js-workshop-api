const express = require('express');
const router = express.Router();
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel")
// Get all products
router.get("/", async (req, res, next) => {
    try {
      const products = await productModel.find();
      res.status(200).json({ products }); // Use JSON response for consistency
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  });

router.get('/:id/order', async (req, res, next) => {
    try {
        const { id } = req.params;

        // ค้นหา Order ที่มี Product ที่มี ID ตรงกับ :id
        const orders = await orderModel.find({ 'products.product': id });

        res.status(200).json({ orders });
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
try {
    const { product_name, price, amount } = req.body;
    let newProduct = new productModel({
        product_name: product_name,
        price: price,
        amount: amount,
    });
    let product = await newProduct.save();
    return res.status(201).send({ 
        status: 201,
        message: "create success",
        data: product,
    });
} catch(error) {
    console.log(error)
    return res.status(500).send({
        status: 500,
        message: "create fail",
    });
}
});

router.post('/:id/order', async (req, res, next) => {
    try {
      const { id } = req.params; 
      const { products, totalPrice } = req.body; 
      // หา Product ที่ต้องการสั่งซื้อ
      const product = await productModel.findById(id);
      if (!product) {
        return res.status(404).send({ message: 'Product not found' });
      }
      
      // check stock
      const newOrderItems = products.map(productOrder => {
        const { quantity } = productOrder;
        if (quantity > product.amount) {
            return res.status(400).send({
                 message: 'Insufficient stock',
                 leftover: product.amount
            });
        }
        return {
            product: id,
            quantity
        };
      });

  
         // สร้าง Order ใหม่
      const newOrder = new orderModel({
        products: newOrderItems,
        totalPrice
      });
  
      // Save the new order to the database
      const order = await newOrder.save();
      
      // ลดจำนวนสินค้าคงคลัง
      newOrderItems.forEach(item => {
        if (item.quantity <= product.amount) {
            product.amount -= item.quantity;
        }
        });
      await product.save();

      // Respond with success message and created order data
      return res.status(201).send({ message: 'Order created successfully', data: order });
    } catch (error) {
      console.error(error); // Log error for debugging
      next(error); // Pass error to middleware for handling
    }
  });
  // Get a specific product by ID
router.get("/:id", async (req, res, next) => {
try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    if (!product) {
    return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
} catch (error) {
    next(error);  
// Pass the error to the error handling middleware
}
});


  
// Update a product by ID
router.put("/:id", async (req, res, next) => {
try {
    const productId = req.params.id;
    const updates = req.body;
    const product = await productModel.findByIdAndUpdate(productId, updates, { new: true });
    if (!product) {
    return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
} catch (error) {
    next(error);  
// Pass the error to the error handling middleware
}
});

// Delete a product by ID
router.delete("/:id", async (req, res, next) => {
try {
    const productId = req.params.id;
    const product = await productModel.findByIdAndDelete(productId);
    if (!product) {
    return res.status(404).json({  
      message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted" });
} catch (error)  
{
    next(error); // Pass the error to the error handling middleware
}
});


module.exports = router ;