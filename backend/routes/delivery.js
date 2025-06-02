const router = require('express').Router();
const CommunicationLog = require('../models/CommunicationLog');
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

// Simulated vendor receipt endpoint
router.post('/delivery-receipt', async (req, res) => {
  try {
    const { logId, status } = req.body;
    await redis.xadd('update:receipts', '*', 'data', JSON.stringify({ logId, status }));
    res.status(202).json({ message: 'Receipt received and queued.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to queue delivery receipt.' });
  }
});

module.exports = router;
