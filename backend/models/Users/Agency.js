const mongoose = require('mongoose')

const agencySchema = new mongoose.Schema({

    // nameOfAgency : acutal name of the agency
    nameOfAgency: {
        type: String,
        required: true,
    },

    // agencyType : Mentor, Incubator, Angel Investor, Venture Capitalist 
    agencyType: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

})

module.exports = mongoose.model('Agency', agencySchema)