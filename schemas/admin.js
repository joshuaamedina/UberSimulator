const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        assignedRider: {
            type: mongoose.ObjectId,
            ref: 'Rider'
        },
        assignedDriver: {
            type: mongoose.ObjectId,
            ref: 'Driver'
        },
        assignedAdmin: {
            type: mongoose.ObjectId,
            ref: 'Admin'
        }
    });

mongoose.model('Admin', AdminSchema);
module.exports = mongoose.model('Admin');