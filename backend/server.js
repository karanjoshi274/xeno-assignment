const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis').default; // ✅ note the `.default`

console.log('connect-redis version:', require('connect-redis/package.json').version);


const cors = require('cors');

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const campaignRoutes = require('./routes/campaign');
const deliveryRoutes = require('./routes/delivery');
const aiRoutes = require('./routes/ai');
const { initPassport } = require('./utils/passport');

dotenv.config();
const app = express();

// Redis client
const redis = new Redis(process.env.REDIS_URL);

const store = new RedisStore({
  client: redis,
  prefix: 'sess:', // optional but recommended
});
// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Session
app.use(
  session({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Passport
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api', dataRoutes);
app.use('/api', campaignRoutes);
app.use('/api', deliveryRoutes);
app.use('/api', aiRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
