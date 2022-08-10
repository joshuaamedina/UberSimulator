const mongoose = require('mongoose');

const RiderSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        location: String,
        destination: String,
        assignedDriver:{
            type: mongoose.ObjectId,
            ref: 'Driver'
        }
    });

mongoose.model('Rider', RiderSchema);
module.exports = mongoose.model('Rider');