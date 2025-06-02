const mongoose = require('mongoose');
const Redis = require('ioredis');
const dotenv = require('dotenv');
const Order = require('../models/Order');

dotenv.config();
const redis = new Redis(process.env.REDIS_URL);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Order Worker: MongoDB connected');
  listenToStream();
});

async function listenToStream() {
  while (true) {
    const res = await redis.xread('BLOCK', 0, 'STREAMS', 'ingest:orders', '$');
    const streamData = res?.[0]?.[1];
    for (const [id, [key, val]] of streamData) {
      try {
        const parsed = JSON.parse(val);
        await Order.create(parsed);
        console.log('Inserted order:', parsed.amount);
      } catch (err) {
        console.error('Order Worker Error:', err);
      }
    }
  }
}