const mongoose = require('mongoose');
const Redis = require('ioredis');
const dotenv = require('dotenv');
const Customer = require('../models/Customer');

dotenv.config();
const redis = new Redis(process.env.REDIS_URL);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Customer Worker: MongoDB connected');
  listenToStream();
});

async function listenToStream() {
  while (true) {
    const res = await redis.xread('BLOCK', 0, 'STREAMS', 'ingest:customers', '$');
    const streamData = res?.[0]?.[1];
    for (const [id, [key, val]] of streamData) {
      try {
        const parsed = JSON.parse(val);
        await Customer.create(parsed);
        console.log('Inserted customer:', parsed.email);
      } catch (err) {
        console.error('Customer Worker Error:', err);
      }
    }
  }
}