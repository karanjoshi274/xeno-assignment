const mongoose = require('mongoose');
const Redis = require('ioredis');
const dotenv = require('dotenv');
const CommunicationLog = require('../models/CommunicationLog');

dotenv.config();
const redis = new Redis(process.env.REDIS_URL);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Receipt Worker: MongoDB connected');
  listenToStream();
});

async function listenToStream() {
  while (true) {
    const res = await redis.xread('BLOCK', 0, 'STREAMS', 'update:receipts', '$');
    const streamData = res?.[0]?.[1];
    for (const [id, [key, val]] of streamData) {
      try {
        const { logId, status } = JSON.parse(val);
        await CommunicationLog.findByIdAndUpdate(logId, { status });
        console.log('Updated delivery status for log:', logId);
      } catch (err) {
        console.error('Receipt Worker Error:', err);
      }
    }
  }
}
