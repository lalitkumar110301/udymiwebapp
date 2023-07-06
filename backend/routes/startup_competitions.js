const express = require('express')
const router = express.Router()
const ProblemStatement = require('../models/Udymi/ProblemStatement');
const StartupCompetition = require('../models/Udymi/StartupCompetition');

// add competition details
router.post('/add', async (req, res) => {
    try {
        const { name, registrationStarts, registrationEnds, link } = req.body;

        if (!name) {
            return res.status(400).json({ error: "name cannot be empty" })
        }

        if (registrationEnds < registrationStarts) {
            return res.status(400).json({ error: "invalid registratin-end date" })
        }

        const newCompetition = await StartupCompetition.create({ name, registrationStarts, registrationEnds, link })

        return res.status(200).json({ success: true, message: "successfully added" })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: "something went wrong while adding competition details" })
    }
})

// delete competition
router.delete('/delete/:id', async (req, res) => {
    try {

        const result = await StartupCompetition.findById(req.params.id)
        if (!result) {
            return res.status(400).json({ error: "competition detail not found" })
        }
        const deleteResult = await StartupCompetition.findByIdAndDelete(req.params.id)

        if (deleteResult) {
            return res.status(200).json({ success: true, message: "successfully deleted" })
        }

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: "something went wrong while deleting" })
    }

})

// edit competition details
router.put('/update/:id', async (req, res) => {

    const { name, registrationStarts, registrationEnds, link } = req.body
    newDetails = {}

    if (name) newDetails.name = name;
    if (registrationStarts) newDetails.registrationStarts = registrationStarts;
    if (registrationEnds) newDetails.registrationEnds = registrationEnds;
    if (link) newDetails.link = link;

    try {
        const comp = await StartupCompetition.findById(req.params.id)
        if (!comp) {
            return res.status(400).json({ error: "competition details not found" })
        } else {
            updatedDetals = await StartupCompetition.findByIdAndUpdate(req.params.id, { $set: newDetails }, { new: true })

            return res.status(200).json({ success: true, message: "successfully updated" })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: "something went wrong while updating" })
    }
})

// get all competitions
router.get('/getall', async (req, res) => {
    try {
        const allStartupCompetitions = await StartupCompetition.find().exec()
        res.status(200).json({ allStartupCompetitions })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: "something went wrong while getting all competitions" })
    }
})


// get competition details by name or active status or both
// router.get('/search', async (req, res) => {
//     try {
//         const query = req.query
//         const result = await StartupCompetition.find({
//             name: new RegExp(query.name, 'i'),
//             active: query.active,
//         });
//         res.status(200).json({ result })
//     } catch (error) {
//         console.log(error.message)
//         return res.status(500).json({ error: "something went wrong while getting competitions" })
//     }
// })


module.exports = router;