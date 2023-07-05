const express = require('express')
const router = express.Router()
const ProblemStatement = require('../models/Udymi/ProblemStatement')
const fetchuser = require('../middleware/fetchuser')


// add a problem statement using: POST 
router.post('/add', async (req, res) => {

    try {

        const { problemTitle, createdBy, startDate, endDate } = req.body;

        if (!problemTitle || !startDate || !endDate) {
            return res.status(400).json({ error: "invalid input" })
        }

        else {
            const newProblemStatement = await ProblemStatement.create({ problemTitle, createdBy, startDate, endDate })

            return res.status(200).json({ newProblemStatement })
        }
    } catch (error) {
        console.log('error -> ', error.message)
        return res.status(500).json({ error: "internal server error while adding problem statement" })
    }

})


// fetch all the problem statements corresponding to currently logged in user
router.get('/fetchall', fetchuser, async (req, res) => {
    try {
        // get logged in user
        const user_id = req.user.id

        // get all doc 
        const allProblemStatements = await ProblemStatement.find({ 'createdBy': user_id }).exec()
        return res.status(200).json({ allProblemStatements })

    } catch (error) {
        console.log('error -> ', error.message)
        return res.status(500).json({ error: "internal server error while fetching problem statements" })
    }
})

// delete problem statement using the id
router.delete('/delete/:problemid', async (req, res) => {
    try {
        const problemId = req.params.problemid
        const searchedDoc = await ProblemStatement.findByIdAndDelete(problemId)

        if (searchedDoc) {
            return res.status(200).json({ success: true, message: "document deleted successfully" })
        } else {
            return res.status(400).json({ success: false, message: "document not found" })
        }

    } catch (error) {
        console.log('error -> ', error.message)
        return res.status(500).json({ error: "internal server error while deleting problem statements" })
    }
})

module.exports = router;