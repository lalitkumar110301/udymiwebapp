const mongoose = require('mongoose')

const problemStatementSchema = new mongoose.Schema({
    problemTitle: {
        type: String,
        required: true,
    },

    problemDescription: {
        type: String,
        required: true
    },

    // either students or institutions can put up their problem statement
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    startDate: {
        type: Date,
        required: true,
    },

    endDate: {
        type: Date,
        required: true,
    }

})

module.exports = mongoose.model('ProblemStatement', problemStatementSchema)