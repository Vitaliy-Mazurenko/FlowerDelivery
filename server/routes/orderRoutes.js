const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
    const { email, phone, deliveryAddress, items, totalPrice, userTimeZone } = req.body;

    try {
        const order = new Order({
            email,
            phone,
            deliveryAddress,
            items,
            totalPrice,
            userTimeZone,
        });

        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get order history by email and phone, or by order ID
router.get('/history', async (req, res) => {
    const { email, phone, orderId } = req.query;
    let query = {};

    if (orderId) {
        query._id = orderId;
    } else if (email && phone) {
        query = { email, phone };
    } else {
        return res.status(400).json({ message: 'Please provide orderId or email and phone number.' });
    }

    try {
        const orders = await Order.find(query).populate('items.flower');
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.flower');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
