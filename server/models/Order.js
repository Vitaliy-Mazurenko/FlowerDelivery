const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    flower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flower',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
});

const orderSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
        trim: true,
    },
    items: [orderItemSchema],
    totalPrice: {
        type: Number,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    userTimeZone: {
        type: String,
    },
});

module.exports = mongoose.model('Order', orderSchema);
