import express from "express";
import exphbs from "express-handlebars";
import routes from './routes/routes.js';
import db from './model/db.js';
import bodyParser from 'body-parser';
import path from 'path';
import tailwind from 'tailwindcss';
import { config } from 'dotenv';

import session, { Cookie } from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session'
const MongoDBStore = connectMongoDBSession(session);

config();

const app = express();

const mongodb = process.env.MONGODB_URI;
const dbname = process.env.DB_NAME
const store = new MongoDBStore({
    uri: mongodb + dbname,
    collection: 'sessions',
});

store.on('error', function(error) {
    console.log(error);
});

app.use(session({ //initially a non persistent session is created for a user when they first visit the website and stores it in db sessions, if a user checks remember me when logging in the session will become a persistent session lasting for 3 weeks
    secret: 'ABCDEFG',
    resave: false,
    saveUninitialized: true,
    store: store,
}));

const port = process.env.SERVER_PORT;

import { fileURLToPath }        from 'url';
import { dirname, join }        from 'path';

app.engine("hbs", exphbs.engine({extname: 'hbs', defaultLayout: 'main'}));
app.set("view engine", "hbs");
app.set("views", "./views");

app.use (express.static(`public`) );
app.use ( '/uploads', express.static(path.join(dirname(fileURLToPath(import.meta.url)), 'uploads')));
app.use ( express.urlencoded({ extended: true }));
app.use ( bodyParser.urlencoded({ extended: true }));
app.use ( bodyParser.json() );
app.use ( express.json() );


app.use(`/`, routes); 

db.connect();

app.listen(port, function () {
    console.log(`Server is running at:`);
    console.log(`http://localhost:` + port);
});


