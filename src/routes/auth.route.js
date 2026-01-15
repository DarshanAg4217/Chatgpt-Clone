const express = require('express');
const { registerAuth, loginAuth } = require('../controller/auth.controller');


const route = express.Router();


route.post('/register', registerAuth)
route.post('/login', loginAuth)

module.exports = route;