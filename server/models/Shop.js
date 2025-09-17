const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
});

module.exports = mongoose.model('Shop', shopSchema);
