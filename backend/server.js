const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis')(session);
const cors = require('cors');

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const campaignRoutes = require('./routes/campaign');
const deliveryRoutes = require('./routes/delivery');

const { initPassport } = require('./utils/passport');

dotenv.config();
const app = express();

const aiRoutes = require('./routes/ai');
app.use('/api', aiRoutes);


// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Redis
const redis = new Redis(process.env.REDIS_URL);
const redisStore = new RedisStore({ client: redis });

// Session
app.use(
  session({
    store: redisStore,
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

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
