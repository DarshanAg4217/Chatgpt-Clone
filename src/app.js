const express = require('express');
const cookieParser = require('cookie-parser');



const app = express();

/* Middleware */
app.use(express.json());
app.use(cookieParser())

/* Route Imports */
const authRoute = require('./routes/auth.route');
const chatRoute = require('./routes/chat.route');


/* using Routes */
app.use('/api/auth', authRoute);
app.use('/api/chat', chatRoute);


module.exports = app;