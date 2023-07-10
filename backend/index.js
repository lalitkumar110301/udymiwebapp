require('dotenv').config()
const connectToMongo = require('./db')
const express = require('express')
const bodyParser = require('body-parser')


const app = express()
const port = process.env.PORT


// cors is used to allow browser to make api calls from localhost
var cors = require('cors')
app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// connecting to mongodb
connectToMongo().then(() => {
    console.log('Connected To MongoDB sucessfully')
}).catch((error) => console.log(error))


// middleware to pass the req.body params
app.use(express.json())


// all available routes
app.use('/api/auth/', require('./routes/auth.js'))
app.use('/api/udymi/problemstatement/', require('./routes/problem_statement.js'))
app.use('/api/udymi/startupcompetitions/', require('./routes/startup_competitions.js'))
app.use('/api/udymi/ideas/', require('./routes/idea_submission.js'))


app.listen(port, () => {
    console.log(`The App is listening on port ${port}`)
})