const express = require('express')
const upload = require('../middleware/uploader')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const IdeaSubmission = require('../models/Udymi/IdeaSubmission')

// idea submission by the user 
router.post('/submit', upload.single('fileInput'), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: "no file found" })
        }

        // accessing the uploaded file from 'uploads' folder
        let filepath = path.join(__dirname, '..', 'uploads', req.file.filename)
        attachment = fs.readFileSync(filepath)

        const { problemId, ideaDescription, userId } = req.body

        if (!problemId || !ideaDescription || !userId) {
            return res.status(400).json({ error: "please enter all fields" })
        }


        // check if already submitted
        const alreadySubmitted = await IdeaSubmission.find({ userId: userId, problemId: problemId })

        if (alreadySubmitted.length !== 0) {
            return res.status(400).json({ message: "Already Submitted for this problem" })
        }

        const Idea = await IdeaSubmission.create({ problemId, ideaDescription, userId, attachment })

        if (Idea) {

            // delete the file from the 'uploads'
            fileToDelete = filepath
            fs.unlink(fileToDelete, (err) => {
                if (err) {
                    console.log("something went wrong")
                }
            })

            return res.status(200).json({ success: true, message: "successfully created" })
        }

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "internal server error while uploading" })
    }
})

// fetch all ideas submitted by the user
router.get('/submittedbyuser/:userid', async (req, res) => {
    try {

        const allUserSubmissins = await IdeaSubmission.find({ userId: req.params.userid })
        return res.status(200).json(allUserSubmissins)

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "internal server error" })
    }
})

// open pdf file of the idea 
router.get('/attachment', async (req, res) => {
    try {
        const { userid, problemid } = req.query
        const file = await IdeaSubmission.findOne({ userId: userid, problemId: problemid })

        if (file) {
            res.contentType('application/pdf')
            res.send(file.attachment)
        } else {
            return res.status(400).json({ error: "file not found" })
        }

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "internal server error" })
    }
})


// fetch all ideas submitted for a particular problem
router.get('/submittedforproblem/:problemid', async (req, res) => {
    try {
        const allIdeas = await IdeaSubmission.find({ problemId: req.params.problemid })

        return res.status(200).json(allIdeas)

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: "internal server error" })
    }
})


// delete a particular idea [can only be done by the one who has posted the problem statement]
router.delete('/delete/:id', async (req, res) => {
    try {
        let ideaToDel = await IdeaSubmission.findById(req.params.id)
        if (!ideaToDel) {
            return res.status(400).json({ success: false, message: "Idea not found" })
        } else {
            ideaToDel = await IdeaSubmission.findByIdAndDelete(req.params.id)
            if (ideaToDel) {
                return res.status(200).json({ success: true, message: "successfully deleted" })
            } else {
                return res.status(500).json({ success: false, message: "failed to delete" })
            }
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: "internal server error" })
    }
})

module.exports = router;