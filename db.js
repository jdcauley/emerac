const fs = require('fs');
const path = require('path');
const postgresAdapter = require('sails-postgresql');
const diskAdapter = require('sails-disk');
const Waterline = require('waterline');
const orm = new Waterline();

var migration = process.env.MIGRATE || 'alter';

const db = {
  adapters: {
    postgresql: postgresAdapter
  },
   connections: {
    postgres: {
      adapter: 'postgresql',
      url: process.env.DATABASE_URL,
      ssl: process.env.SSL_STATUS
    }
  }
};

var normalizedPath = path.join(__dirname, 'api/models');

fs.readdirSync(normalizedPath).forEach(function(file) {
  var model = require("./api/models/" + file);
  model.migrate = migration;
  model.connection = 'postgres';
  model = Waterline.Collection.extend(model);
  orm.loadCollection(model);
});

module.exports = {waterline: orm, config: db};