const mongoose = require('mongoose')

const IdeaSubmissionSchema = new mongoose.Schema({
    problemId: {
        type: String,
        required: true
    },

    ideaDescription: {
        type: String,
        required: true
    },

    attachment: {
        type: Buffer,
        required: true
    },

    userId: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model("IdeaSubmission", IdeaSubmissionSchema)