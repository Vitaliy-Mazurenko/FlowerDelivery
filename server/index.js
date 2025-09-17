const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const shopRoutes = require('./routes/shopRoutes');
const flowerRoutes = require('./routes/flowerRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/shops', shopRoutes);
app.use('/api/flowers', flowerRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Flower Delivery API');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
