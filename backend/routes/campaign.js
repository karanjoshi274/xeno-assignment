const router = require('express').Router();
const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');
const CommunicationLog = require('../models/CommunicationLog');

// Simple evaluator (mock logic for now)
function filterCustomers(customers, rules) {
  return customers.filter(c => {
    const spend = c.totalSpend || 0;
    const visits = c.visits || 0;
    const inactiveDays = (Date.now() - new Date(c.lastActive)) / (1000 * 60 * 60 * 24);
    return (
      (spend > (rules.spend || 0)) &&
      (visits < (rules.visits || Infinity)) &&
      (inactiveDays > (rules.inactive || 0))
    );
  });
}

router.post('/campaigns', async (req, res) => {
  try {
    const { name, rules } = req.body;
    const customers = await Customer.find();
    const filtered = filterCustomers(customers, rules);
    const campaign = await Campaign.create({ name, rules, audienceSize: filtered.length });

    for (const cust of filtered) {
      const message = `Hi ${cust.name}, here’s 10% off on your next order!`;
      const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';
      await CommunicationLog.create({ campaignId: campaign._id, customerId: cust._id, status, message });
    }

    res.status(201).json({ campaignId: campaign._id, audienceSize: filtered.length });
  } catch (err) {
    res.status(500).json({ error: 'Campaign creation failed.' });
  }
});

router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch campaigns.' });
  }
});

module.exports = router;
