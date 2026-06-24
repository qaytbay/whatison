const router = require('express').Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const automations = await db.automations.find({});
    res.json(automations);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id/toggle', async (req, res) => {
  try {
    const auto = await db.automations.findOne({ _id: req.params.id });
    if (!auto) return res.status(404).json({ error: 'Not found' });
    await db.automations.update({ _id: req.params.id }, { $set: { active: !auto.active } });
    const updated = await db.automations.findOne({ _id: req.params.id });
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
