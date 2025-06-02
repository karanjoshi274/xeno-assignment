const router = require('express').Router();
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

router.post('/customers', async (req, res) => {
  try {
    const customerData = req.body;
    await redis.xadd('ingest:customers', '*', 'data', JSON.stringify(customerData));
    res.status(202).json({ message: 'Customer ingestion queued.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to ingest customer data.' });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const orderData = req.body;
    await redis.xadd('ingest:orders', '*', 'data', JSON.stringify(orderData));
    res.status(202).json({ message: 'Order ingestion queued.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to ingest order data.' });
  }
});

module.exports = router;