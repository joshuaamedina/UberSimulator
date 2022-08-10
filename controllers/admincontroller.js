
const express = require('express');
const axios = require('axios');
const DriverModel = require('./driver');
const RiderModel = require('./rider');
const AdminModel = require('./admin');
const router = express.Router();
const locations = require('./locationData.json');
router.use(express.json());

const config = {
    headers:{
        'X-Api-Key': '6d542129c59047eb9854b0b0a35bc431'
    }
}

const carColors = ["white", "black", "grey", "yellow", "red", "blue", "green", "brown", "pink", "orange", "purple"];
const carTypes = ["suv", "truck", "sedan", "van", "coupe", "wagon", "convertible", "sport","diesel", "crossover", "luxury", "hybrid"];

//add a new rider

router.post('/newRider', async (req, res) => {
    const {firstName, lastName, email} = req.body;

    const newRider = {
        firstName,
        lastName,
        email,
        location: null,
        destination: null,
        assignedDriver: null
    };

    await RiderModel.create(newRider, (err, rider) => {
        if (err) return res.send(500);
        return res.send(rider);
    });
});

//remove rider with ID
router.delete('/:riderId', async (req, res) => {

    const foundRider = await RiderModel.findById(req.params.riderId, (err, rider) => {
        if (err) return res.send(500);
        return rider;
    });

    try {
        await RiderModel.findByIdAndDelete(req.params.riderId);

        return res.json({ msg: `Rider with ID: ${req.params.riderId} has been deleted` });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send('A server error has occured...');
    }
});

//adding a new driver
router.post('/newDriver', async (req, res) => {
    const {firstName, lastName, email} = req.body;

    const newDriver = {
        firstName,
        lastName,
        email,
        available:true,
        location:null,
        wallet: 0,
        rating: 0,
        numberOfRatings: 0,
        carType: carTypes[Math.floor(Math.random() * carTypes.length)],
        carColor: carColors[Math.floor(Math.random() * carColors.length)],
        assignedRider: null
    };

    DriverModel.create(newDriver, (err, driver) => {
        if (err) return res.send(500);
        return res.send(driver);
    });
});

//remove driver with ID
router.delete('/:driverId', async (req, res) => {

    const foundDriver = await DriverModel.findById(req.params.driverId, (err,driver) => {
        if (err) return res.send(500);
        return driver;
    });

    try {
        await DriverModel.findByIdAndDelete(req.params.driverId);

        return res.json({ msg: `Driver with ID: ${req.params.driverId} has been deleted` });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send('A server error has occured...');
    }
});

module.exports = router;