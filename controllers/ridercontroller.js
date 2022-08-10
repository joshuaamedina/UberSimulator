const express = require('express');
const axios = require('axios').default;
const DriverModel = require('./driver');
const RiderModel = require('./rider');
const router = express.Router();
router.use(express.json());

//GET ALL RIDERS
router.get('/', (req, res) => {
    RiderModel.find({}, (err, users) => {
        if (err) return res.send(500);
        return res.send(users);
    });
});

//RIDER CAN SELECT DRIVER BY ID
router.post('/:riderId/selectDriverById/:driverId', async (req, res) =>{
    const rider = await RiderModel.findByIdAndUpdate(req.params.riderId, {
        assignedDriver: req.params.driverId
    })
    const driver = await DriverModel.findByIdAndUpdate(req.params.driverId, {assignedRider: req.params.riderId})
    res.send(await RiderModel.findById(req.params.riderId));
})

//RIDER CAN SET LOCATION
router.post('/:riderId/location', async (req, res) => {
    const rider = await RiderModel.findByIdAndUpdate(req.params.riderId, {
        location: req.body.location
    })
    res.send(await RiderModel.findById(req.params.riderId));
})

//RIDER CAN SET DESTINATION
router.post('/:riderId/destination', async (req, res) => {
    const rider = await RiderModel.findByIdAndUpdate(req.params.riderId, {
        destination: req.body.destination
    })
    res.send(await RiderModel.findById(req.params.riderId));
})

//RIDER CAN SEE ALL NEARBY DRIVERS
router.get('/:riderId/nearByDrivers', async (req, res) => {

    let foundRider = await RiderModel.findById(req.params.riderId, (err, rider) => {
        if (err) return res.send(500);
        return rider;
    });
    if(!foundRider) return res.send(404);
    let origin = foundRider.location;

    let allDrivers = await DriverModel.find();
    let nearByDrivers = [];

    let counter  = 0;

    allDrivers.forEach((driver, index) => {

        let destination = driver.location;
        if (!destination) return res.sendStatus(404);
        var mapConfig = {
            method: 'get',
            url: 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=' + origin + '&destinations=' + destination + '&key=AIzaSyCvmwnLn_888W53ksV_egkWShyJIqCirO0',
            headers: { }
        };

        axios(mapConfig)
            .then(function (response) {
                let x = response.data

                let y = (x.rows[0].elements[0].distance.text);

                let z = (Math.round(parseFloat(y)*100)/100)

                if (z <= parseFloat(10.0)){
                    if(driver.available)
                        nearByDrivers.push(driver._id);
                }

                if(counter+1 == allDrivers.length) {
                    return res.send(nearByDrivers|| 404);
                }
                counter++;

            })
            .catch(function (error) {
                console.log(error);
            });
    })

})

//RIDER CAN SEE LOCATION OF THE ASSIGNED DRIVER
router.get('/:riderId/assignedDriver/location', async (req, res) => {
    const foundRider = await RiderModel.findById(req.params.riderId, (err, rider) => {
        if (err) return res.send(500);
        return rider;
    });
    if(!foundRider) return res.send(404);
    const foundDriver = await DriverModel.findById(foundRider.assignedDriver);
    res.send(foundDriver.location || 404);
})

//ALLOW RIDER TO LEAVE TIP
router.post('/:riderId/assignedDriver/tip', async (req, res) =>{
    let tip = req.body.tip;
    let foundRider = await RiderModel.findById(req.params.riderId, (err, rider) => {
        if (err) return res.send(500);
        return rider;
    });
    if(!foundRider) return res.send(404);
    const foundDriver = await DriverModel.findById(foundRider.assignedDriver);
    let wallet = foundDriver.wallet + tip;
    await DriverModel.findByIdAndUpdate(foundRider.assignedDriver, {wallet: wallet});
    res.send("Driver has been tipped $" + tip);

})

//ALLOW RIDER TO LEAVE RATING BETWEEN 0-5
router.post('/:riderId/assignedDriver/rating', async (req, res) =>{
    let givenRating = parseInt(req.body.rating);
    if(givenRating < 0 || givenRating > 5)
        res.send("Invalid Rating");
    let foundRider = await RiderModel.findById(req.params.riderId, (err, rider) => {
        if (err) return res.send(500);
        return rider;
    });
    if(!foundRider) return res.send(404);
    const foundDriver = await DriverModel.findById(foundRider.assignedDriver);
    let numRating = foundDriver.numberOfRatings + 1;

    let newRating = (foundDriver.rating) * (foundDriver.numberOfRatings);
    newRating += givenRating;
    newRating = newRating / numRating;

    await DriverModel.findOneAndUpdate({_id:foundRider.assignedDriver}, {numberOfRatings: numRating, rating: newRating});
    let updatedDriver = await DriverModel.findById(foundRider.assignedDriver);
    res.send(updatedDriver);


})

module.exports = router;