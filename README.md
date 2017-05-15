# API Boilerplate build with Express and Sequelize

### Why does this exist?

Because I don't want to write the same things over and over again and I wanted an explicit Express API Boilerplate useful in a variety of situations. I also didn't want to manually require each controller and model in my index file, so there are simple methods to include those for me.

Autoload controllers and Models to the Express app object.

.env Variables
```
ROOT_URL // project url for generated urls
DATABASE_URL // example: postgres://localhost:5432/boilerplate
SSL_STATUS // for db Connection
JWT_SECRET // used for token gen
POSTMARK_KEY // used for mail functions
```

## Get Started

### Create a postgres database.
I'm on OSX and used http://postgresapp.com

### Update/Create .env file
I've provided a .env-example file which will work with only a db url change.
Update the db url and change the file from .env-example to .env

### Install Dependencies
```npm install```

### Start the server
```npm start```