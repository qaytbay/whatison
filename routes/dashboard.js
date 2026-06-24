const router = require('express').Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/dashboard/kpis
router.get('/kpis', async (req, res) => {
  try {
    const [contacts, campaigns, automations] = await Promise.all([
      db.contacts.count({}),
      db.campaigns.find({}),
      db.automations.find({}),
    ]);

    const totalRevenue = automations.reduce((s, a) => s + (a.revenueAll || 0), 0);
    const revenue30d = automations.reduce((s, a) => s + (a.revenue30d || 0), 0);
    const campaignRevenue = campaigns.reduce((s, c) => s + (c.revenue || 0), 0);
    const liveCampaigns = campaigns.filter(c => c.status === 'live').length;
    const activeAutos = automations.filter(a => a.active).length;

    res.json({
      contacts,
      totalRevenue: totalRevenue.toFixed(2),
      revenue30d: revenue30d.toFixed(2),
      campaignRevenue: campaignRevenue.toFixed(2),
      liveCampaigns,
      activeAutomations: activeAutos,
      messagesSent: 24812,
      openRate: 97.4,
      avgOrderValue: 526,
      attributedOrders: 752,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/dashboard/automations-revenue
router.get('/automations-revenue', async (req, res) => {
  try {
    const automations = await db.automations.find({});
    res.json(automations);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/dashboard/recent-campaigns
router.get('/recent-campaigns', async (req, res) => {
  try {
    const campaigns = await db.campaigns.find({});
    campaigns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(campaigns.slice(0, 5));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
