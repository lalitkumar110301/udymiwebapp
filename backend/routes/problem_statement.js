const express = require('express')
const router = express.Router()
const ProblemStatement = require('../models/Udymi/ProblemStatement')
const fetchuser = require('../middleware/fetchuser')


// add a problem statement using: POST 
router.post('/add', async (req, res) => {

    try {

        const { problemTitle, problemDescription, createdBy, startDate, endDate } = req.body;

        if (!problemTitle || !problemDescription || !startDate || !endDate) {
            return res.status(400).json({ error: "invalid input" })
        }

        else {
            const newProblemStatement = await ProblemStatement.create({ problemTitle, problemDescription, createdBy, startDate, endDate })

            return res.status(200).json({ success: true, message: "successfully added problem statement" })
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

// update problem statement using id
router.put('/update/:id', async (req, res) => {
    try {
        const result = await ProblemStatement.findById(req.params.id)
        if (!result) {
            return res.status(400).json({ error: "Problem Statement Not Found" })
        }

        const { problemTitle, problemDescription, startDate, endDate } = req.body;
        let newProblemStatement = {}

        if (problemTitle) newProblemStatement.problemTitle = problemTitle
        if (problemDescription) newProblemStatement.problemDescription = problemDescription
        if (startDate) newProblemStatement.startDate = startDate
        if (endDate) newProblemStatement.endDate = endDate

        const updatedDetails = await ProblemStatement.findByIdAndUpdate(req.params.id, { $set: newProblemStatement }, { new: true })

        return res.status(200).json({ success: true, message: "successfully updated" })

    } catch (error) {
        console.log('error -> ', error.message)
        return res.status(500).json({ error: "internal server error while updating" })
    }
})


// search for a problem statement by using problemTitle field
router.get('/search', async (req, res) => {
    const query = req.query;
    try {
        const result = await ProblemStatement.find({ problemTitle: new RegExp(query.title, 'i') })
        return res.status(200).json({ result })

    } catch (error) {
        console.log('error -> ', error.message)
        return res.status(500).json({ error: "internal server error while searching" })
    }

})

module.exports = router;