require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const contactsRoutes = require('./routes/contacts');
const campaignsRoutes = require('./routes/campaigns');
const automationsRoutes = require('./routes/automations');
const adminRoutes = require('./routes/admin');
const { seedDB } = require('./db/seed');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/automations', automationsRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend
app.get('/admin*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Seed DB then start
seedDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Whatison running at http://localhost:${PORT}`);
    console.log(`📊 Admin panel: http://localhost:${PORT}/admin`);
    console.log(`🔑 Login: admin@Whatison.com / admin123`);
  });
});
