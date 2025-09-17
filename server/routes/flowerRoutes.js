const express = require('express');
const router = express.Router();
const Flower = require('../models/Flower');

// Get flowers by shop, with sorting and pagination
router.get('/', async (req, res) => {
    const { shopId, sortBy, page = 1, limit = 8 } = req.query;
    const query = shopId ? { shop: shopId } : {};
    const sortOptions = {};

    if (sortBy === 'price') {
        sortOptions.price = 1;
    } else if (sortBy === 'dateAdded') {
        sortOptions.dateAdded = -1;
    }

    try {
        const total = await Flower.countDocuments(query);
        let flowersQuery = Flower.find(query);

        flowersQuery = flowersQuery.sort({ isFavorite: -1, ...sortOptions });

        const flowers = await flowersQuery
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));
        
        res.json({
            flowers,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const flower = new Flower({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
        shop: req.body.shop,
    });
    try {
        const newFlower = await flower.save();
        res.status(201).json(newFlower);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Toggle favorite status of a flower
router.patch('/:id/favorite', async (req, res) => {
    try {
        const flower = await Flower.findById(req.params.id);
        if (!flower) {
            return res.status(404).json({ message: 'Flower not found' });
        }
        flower.isFavorite = !flower.isFavorite;
        await flower.save();
        res.json(flower);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
