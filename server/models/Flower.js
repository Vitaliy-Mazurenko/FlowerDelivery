const mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Flower', flowerSchema);
