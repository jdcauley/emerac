# Emerac

### Why does this exist?

Because I don't want to write the same things over and over again and I wanted an explicit Express API Boilerplate useful in a variety of situations. I also didn't want to manually require each controller and model in my index file, so there are simple methods to include those for me.

Autoload controllers and Models to the Express app object.

## Get Started

### Install Dependencies

```npm install```
or
```yarn install```

### Start the server

```npm start```
or
```yarn start```

Thats it, while its pretty easy to set up use for Postgres this app will fallback to a sqlite file.

## Optional

### Update/Create .env file

I've provided a .env-example file which will work with only a db url change.
Update the db url and change the file from .env-example to .env

.env Variables Examples
```
PORT=3000
ROOT_URL=http://localhost:3000 // project url for generated urls
DATABASE_URL=postgres://localhost:5432/boilerplate // a DB URL for postgres (app falls back to sqlite3)
JWT_SECRET=your-very-own-token // used for token gen
POSTMARK_KEY=your-postmark-api-key // I like postmark, update service mailer if you'd like another option
```

### Database Options

This app has default support for a local sqlite db.
If no DATABASE_URL saved in the local .env file the application will create a db.sqlite file in the project root to use locally.

If you want to use a Postgres Database, include the Postgres URL in your .env file as:

```
DATABASE_URL=postgres://localhost:5432/your-local-db-name
```

See the .env example for more

### Create a postgres database.
I'm on OSX and used http://postgresapp.com

Creating a Postgres db is probably thi
