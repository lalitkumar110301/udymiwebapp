// connecting to the mongodb server locally

const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI

const connectToMongo = async () => {
    mongoose.connect(mongoURI)
}

module.exports = connectToMongo;