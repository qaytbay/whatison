const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const db = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.use(authMiddleware, adminOnly);

// GET /api/admin/overview
router.get('/overview', async (req, res) => {
  try {
    const [users, contacts, campaigns, automations] = await Promise.all([
      db.users.find({}),
      db.contacts.count({}),
      db.campaigns.find({}),
      db.automations.find({}),
    ]);
    const totalRevenue = automations.reduce((s,a) => s + (a.revenueAll||0), 0) + campaigns.reduce((s,c) => s + (c.revenue||0), 0);
    const activeAutos = automations.filter(a => a.active).length;
    res.json({
      totalUsers: users.length,
      totalContacts: contacts,
      totalCampaigns: campaigns.length,
      totalAutomations: automations.length,
      activeAutomations: activeAutos,
      totalRevenue: totalRevenue.toFixed(2),
      recentUsers: users.map(u => { const {password,...safe} = u; return safe; }).slice(-5),
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await db.users.find({});
    res.json(users.map(u => { const {password,...safe} = u; return safe; }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/admin/users
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, password required' });
    const existing = await db.users.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });
    const hash = await bcrypt.hash(password, 10);
    const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const user = await db.users.insert({ _id: uuid(), name, email, password: hash, role: role || 'agent', avatar: initials, createdAt: new Date() });
    const {password:_, ...safe} = user;
    res.status(201).json(safe);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/admin/users/:id
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const update = { name, email, role, updatedAt: new Date() };
    if (password) update.password = await bcrypt.hash(password, 10);
    await db.users.update({ _id: req.params.id }, { $set: update });
    const user = await db.users.findOne({ _id: req.params.id });
    const {password:_, ...safe} = user;
    res.json(safe);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.user.id === req.params.id) return res.status(400).json({ error: 'Cannot delete yourself' });
    await db.users.remove({ _id: req.params.id }, {});
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/admin/settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await db.settings.find({});
    const map = {};
    settings.forEach(s => { map[s.key] = s; });
    res.json(map);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/admin/settings/:key
router.put('/settings/:key', async (req, res) => {
  try {
    const existing = await db.settings.findOne({ key: req.params.key });
    if (existing) {
      await db.settings.update({ key: req.params.key }, { $set: { ...req.body, updatedAt: new Date() } });
    } else {
      await db.settings.insert({ ...req.body, key: req.params.key, createdAt: new Date() });
    }
    const updated = await db.settings.findOne({ key: req.params.key });
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
