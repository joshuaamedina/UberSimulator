const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        available: Boolean,
        location: String,
        wallet: Number,
        rating: Number,
        numberOfRatings: Number,
        carType: String,
        carColor: String,
        assignedRider: {
            type: mongoose.ObjectId,
            ref: 'Rider'
        }
    });

mongoose.model('Driver', DriverSchema);
module.exports = mongoose.model('Driver');