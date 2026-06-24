const router = require('express').Router();
const { v4: uuid } = require('uuid');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/contacts
router.get('/', async (req, res) => {
  try {
    const { search, tag, status, limit = 50, skip = 0 } = req.query;
    let query = {};
    if (tag) query.tag = tag;
    if (status) query.status = status;
    let contacts = await db.contacts.find(query);
    if (search) {
      const s = search.toLowerCase();
      contacts = contacts.filter(c => c.name.toLowerCase().includes(s) || c.phone.includes(s) || c.email?.toLowerCase().includes(s));
    }
    contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ total: contacts.length, contacts: contacts.slice(+skip, +skip + +limit) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/contacts/:id
router.get('/:id', async (req, res) => {
  try {
    const contact = await db.contacts.findOne({ _id: req.params.id });
    if (!contact) return res.status(404).json({ error: 'Not found' });
    res.json(contact);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/contacts
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, tag, status } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });
    const contact = await db.contacts.insert({ _id: uuid(), name, phone, email: email || '', tag: tag || 'New', status: status || 'active', orders: 0, revenue: 0, createdAt: new Date() });
    res.status(201).json(contact);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/contacts/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email, tag, status } = req.body;
    await db.contacts.update({ _id: req.params.id }, { $set: { name, phone, email, tag, status, updatedAt: new Date() } });
    const updated = await db.contacts.findOne({ _id: req.params.id });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/contacts/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.contacts.remove({ _id: req.params.id }, {});
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
