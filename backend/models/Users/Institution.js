const mongoose = require('mongoose')

const institutionSchema = new mongoose.Schema({

    // nameOfInstitution: actual name of Institution 
    nameOfInstitution: {
        type: String,
        required: true,
    },

    // institutionType: Government, Private
    institutionType: {
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

module.exports = mongoose.model('Institution', institutionSchema)