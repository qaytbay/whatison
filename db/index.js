const Datastore = require('nedb-promises');
const path = require('path');

const dbPath = path.join(__dirname, '../data');
require('fs').mkdirSync(dbPath, { recursive: true });

const db = {
  users:       Datastore.create({ filename: path.join(dbPath, 'users.db'),       autoload: true }),
  contacts:    Datastore.create({ filename: path.join(dbPath, 'contacts.db'),    autoload: true }),
  campaigns:   Datastore.create({ filename: path.join(dbPath, 'campaigns.db'),   autoload: true }),
  automations: Datastore.create({ filename: path.join(dbPath, 'automations.db'), autoload: true }),
  messages:    Datastore.create({ filename: path.join(dbPath, 'messages.db'),    autoload: true }),
  settings:    Datastore.create({ filename: path.join(dbPath, 'settings.db'),    autoload: true }),
  activity:    Datastore.create({ filename: path.join(dbPath, 'activity.db'),    autoload: true }),
};

module.exports = db;
