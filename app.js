const express = require('express');
const app = express();
const db = require('./db');
const driverController = require('./drivercontroller');
const Rider = require('./rider');
const riderController = require('./ridercontroller');
const adminController = require('./admincontroller');

app.use('/driver', driverController);
app.use('/rider', riderController);
app.use('/admin', adminController);

module.exports = app;