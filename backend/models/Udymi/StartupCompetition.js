const mongoose = require('mongoose');

const StartupCompetitionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    registrationStarts: {
        type: Date,
    },

    registrationEnds: {
        type: Date,
    },

    active: {
        type: Boolean,
        default: function () {
            return Date.now() <= this.registrationEnds;
        }
    },

    link: {
        type: String,
    }

})

module.exports = mongoose.model('StartupCompetition', StartupCompetitionSchema)