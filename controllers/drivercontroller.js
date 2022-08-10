const express = require('express');
const axios = require('axios');
const DriverModel = require('./driver');
const RiderModel = require('./rider');
const router = express.Router();
const locations = require('./locationData.json');
router.use(express.json());

const config = {
    headers:{
        'X-Api-Key': '6d542129c59047eb9854b0b0a35bc431'
    }
}

const initDrivers = async() =>{
    const drivers = [];
    const firstNames = await axios.get('https://randommer.io/api/Name?nameType=firstname&quantity=10', config);
    const lastNames = await axios.get('https://randommer.io/api/Name?nameType=surname&quantity=10', config);
    //we can use promise.all since they do not rely on each other

    firstNames.data.forEach((firstName, index) => {

        const newDriver = {
            firstName: firstName,
            lastName: lastNames.data[index],
            email: firstName + lastNames.data[index] + "@gmail.com",
            available: true,
            location: locations[Math.floor(Math.random() * 50)].address,
            wallet: 0.00,
            rating: 0,
            numberOfRatings: 0,
            assignedRider: null,

        }
        drivers.push(newDriver);

    })
    await DriverModel.create(drivers);
}

const initRiders = async() =>{
    const riders = [];
    const firstNames = await axios.get('https://randommer.io/api/Name?nameType=firstname&quantity=50', config);
    const lastNames = await axios.get('https://randommer.io/api/Name?nameType=surname&quantity=50', config);
    //we can use promise.all since they do not rely on each other

    firstNames.data.forEach((firstName, index) => {

        const newRider = {
            firstName: firstName,
            lastName: lastNames.data[index],
            email: firstName + lastNames.data[index] + "@gmail.com",
            location: locations[Math.floor(Math.random() * 50)].address,
            destination: locations[Math.floor(Math.random() * 50)].address,
            assignedDriver: null,

        }
        riders.push(newRider);

    })
    await RiderModel.create(riders);
}

const init = async () => {
    //await RiderModel.deleteMany();
    //await DriverModel.deleteMany();
    //await initDrivers();
    //await initRiders();

}

init();
// supplemental - get all drivers
router.get('/', (req, res) => {
    DriverModel.find({}, (err, users) => {
        if (err) return res.send(500);
        return res.send(users);
    });
});

// supplemental - create new driver
router.post('/', async (req, res) => {
    const newDriver = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        available: req.body.available,
        location: req.body.location,
        wallet: 0,
        rating: 0,
        numberOfRatings: 0,
        assignedRider: await RiderModel.create({
            firstName: "first",
            lastName: "last",
            email: "email",
            location: "San Marcos",
            destination: "Round Rock"
        })
    };

    DriverModel.create(newDriver, (err, driver) => {
        if (err) return res.send(500);
        return res.send(driver);
    });
})

// get assigned rider location
router.get('/:driverId/assignedRider/location', async (req, res) => {
    const foundDriver = await DriverModel.findById(req.params.driverId, (err, driver) => {
        if (err) return res.send(500);
        return driver;
    });
    if(!foundDriver) return res.send(404);
    const foundRider = await RiderModel.findById(foundDriver.assignedRider);
    res.send(foundRider.location || 404);
})

// get assigned rider destination
router.get('/:driverId/assignedRider/destination', async (req, res) => {
    const foundDriver = await DriverModel.findById(req.params.driverId, (err, driver) => {
        if (err) return res.send(500);
        return driver;
    });
    if(!foundDriver) return res.send(404);
    const foundRider = await RiderModel.findById(foundDriver.assignedRider);
    res.send(foundRider.destination || 404);
})

// update driver position
router.put('/:driverId/location', async (req, res) => {
    const foundDriver = await DriverModel.findById(req.params.driverId);
    if (!foundDriver) return res.send(404);
    foundDriver.location = req.body.location ? req.body.location : foundDriver.location;
    await DriverModel.updateOne({_id: req.params.driverId}, foundDriver);
    res.send(foundDriver);
})

// update driver availability
router.put('/:driverId/availability', async (req, res) => {
    const foundDriver = await DriverModel.findById(req.params.driverId);
    if (!foundDriver) return res.send(404);
    foundDriver.available = !foundDriver.available;
    await DriverModel.updateOne({_id: req.params.driverId}, foundDriver);
    res.send(await DriverModel.findById(req.params.driverId));
})
// view driver wallet
router.get('/:driverId/wallet', async (req,res)=>{
    const foundDriver = await DriverModel.findById(req.params.driverId);
    if (!foundDriver) return res.send(404);
    res.send('$' + foundDriver.wallet + " available for cashout!");

})

module.exports = router;