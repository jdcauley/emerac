const fs        = require("fs")
const path      = require("path")
const Sequelize = require("sequelize")

if (process.env.DATABASE_URL) {
  var sequelize = new Sequelize( process.env.DATABASE_URL );
}

var db = {};

var normalizedPath = path.join(__dirname, 'api/models');

fs.readdirSync(normalizedPath).forEach(function(file) {
  var model = sequelize.import(path.join(normalizedPath, file));
  db[model.name] = model;
});

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

sequelize
  .sync({ force: false })
  .then(function(err) {
    console.log('It worked!');
  }, function (err) { 
    console.log('An error occurred while creating the table:', err);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;