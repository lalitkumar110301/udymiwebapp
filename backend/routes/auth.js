const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const fetchuser = require('../middleware/fetchuser')
const Student = require('../models/Users/Student')
const Institution = require('../models/Users/Institution')
const Agency = require('../models/Users/Agency')


/* Route-1
Creating a user using: POST "/api/auth/createuser" 
Doesn't require authenticating user 
*/
router.post('/createuser/student', [
    body('name', 'name must be atleast 3 characters').isLength({ min: 2 }),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password must be atleast 8 characters').isLength({ min: 8 })
], async (req, res) => {

    // getting validation errors if any
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const { name, email, password, degree } = req.body;
        let student = await Student.findOne({ email: email })

        // if student is already registered
        if (student) {
            return res.status(400).json({ error: 'email already in use' })
        } else {
            // generate hash for the plain text password
            let salt = await bcrypt.genSalt(10)
            let secured_pass = await bcrypt.hash(password, salt);

            // create a new student account
            const newStudent = await Student.create({
                name: name,
                email: email,
                password: secured_pass,
                degree: degree
            })

            // generate authentication token if signup is successfull
            const auth_token = jwt.sign({
                user: {
                    id: newStudent.id,
                    type: "student"
                }
            }, process.env.JWT_SECRET)

            return res.status(200).json({ success: true, auth_token: auth_token })
        }

    } catch (error) {
        console.log('error -> ', error.message)
        return res.status(500).json({ error: "internal server error while signing up" })
    }

})

router.post('/createuser/institution', [
    body('nameOfInstitution', 'name must be atleast 3 characters').isLength({ min: 2 }),
    body('institutionType', 'invalid institution type').isIn(['Government', 'Private']),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password must be atleast 8 characters').isLength({ min: 8 })
], async (req, res) => {
    // getting validation errors if any
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const { nameOfInstitution, institutionType, email, password } = req.body;
        let institution = await Institution.findOne({ email: email })

        // if student is already registered
        if (institution) {
            return res.status(400).json({ error: 'email already in use' })
        } else {
            // generate hash for the plain text password
            let salt = await bcrypt.genSalt(10)
            let secured_pass = await bcrypt.hash(password, salt);

            // create a new student account
            const newInstitution = await Institution.create({
                nameOfInstitution: nameOfInstitution,
                institutionType: institutionType,
                email: email,
                password: secured_pass,
            })

            // generate authentication token if signup is successfull
            const auth_token = jwt.sign({
                user: {
                    id: newInstitution.id,
                    type: "institution"
                }
            }, process.env.JWT_SECRET)

            return res.status(200).json({ success: true, auth_token: auth_token })
        }

    } catch (error) {
        console.log('error -> ', error.message)
        return res.status(500).json({ error: "internal server error while signing up" })
    }
})

router.post('/createuser/agency', [
    body('nameOfAgency', 'name must be atleast 3 characters').isLength({ min: 2 }),
    body('agencyType', 'invalid agency type').isIn(['Mentor', 'Incubator', 'Angel Investor', 'Venture Capitalist']),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password must be atleast 8 characters').isLength({ min: 8 })
], async (req, res) => {
    // getting validation errors if any
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const { nameOfAgency, agencyType, email, password } = req.body;
        let agency = await Agency.findOne({ email: email })

        // if student is already registered
        if (agency) {
            return res.status(400).json({ error: 'email already in use' })
        } else {
            // generate hash for the plain text password
            let salt = await bcrypt.genSalt(10)
            let secured_pass = await bcrypt.hash(password, salt);

            // create a new student account
            const newAgency = await Agency.create({
                nameOfAgency: nameOfAgency,
                agencyType: agencyType,
                email: email,
                password: secured_pass,
            })

            // generate authentication token if signup is successfull
            const auth_token = jwt.sign({
                user: {
                    id: newAgency.id,
                    type: "agency"
                }
            }, process.env.JWT_SECRET)

            return res.status(200).json({ success: true, auth_token: auth_token })
        }

    } catch (error) {
        console.log('error -> ', error.message)
        return res.status(500).json({ error: "internal server error while signing up" })
    }
})

/* Route-2
Allowing a user to login using: POST "/api/auth/login" 
Requires user authentication
*/
router.post('/login/student', [
    body('email', 'invalid email').isEmail(),
    body('password', 'password must be 8 characters long').isLength({ min: 8 })
], async (req, res) => {

    // getting validation errors if any
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    const { email, password } = req.body;

    try {

        // check if user exists
        const student = await Student.findOne({ email: email })
        if (!student) {
            return res.status(400).json({ success: false, message: "invalid credentials" })
        }

        // check password if user exists
        const password_compare = await bcrypt.compare(password, student.password)
        if (!password_compare) {
            return res.status(400).json({ success: false, message: "invalid credentials" })
        }

        // if user is authenticated : generate an authentication token
        const auth_token = jwt.sign({
            user: {
                id: student.id,
                type: "student"
            }
        }, process.env.JWT_SECRET)

        return res.status(200).json({ success: true, auth_token: auth_token })

    } catch (error) {
        console.log('error -> ', error.message)
        return res.status(500).json({ error: "internal server error while log-in" })
    }
})

router.post('/login/institution', [
    body('email', 'invalid email').isEmail(),
    body('password', 'password must be 8 characters long').isLength({ min: 8 })
], async (req, res) => {

    // getting validation errors if any
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    const { email, password } = req.body;

    try {

        // check if user exists
        const institution = await Institution.findOne({ email: email })
        if (!institution) {
            return res.status(400).json({ success: false, message: "invalid credentials" })
        }

        // check password if user exists
        const password_compare = await bcrypt.compare(password, institution.password)
        if (!password_compare) {
            return res.status(400).json({ success: false, message: "invalid credentials" })
        }

        // if user is authenticated : generate an authentication token
        const auth_token = jwt.sign({
            user: {
                id: institution.id,
                type: "institution"
            }
        }, process.env.JWT_SECRET)

        return res.status(200).json({ success: true, auth_token: auth_token })

    } catch (error) {
        console.log('error -> ', error.message)
        return res.status(500).json({ error: "internal server error while log-in" })
    }
})

router.post('/login/agency', [
    body('email', 'invalid email').isEmail(),
    body('password', 'password must be 8 characters long').isLength({ min: 8 })
], async (req, res) => {

    // getting validation errors if any
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    const { email, password } = req.body;

    try {

        // check if user exists
        const agency = await Agency.findOne({ email: email })
        if (!agency) {
            return res.status(400).json({ success: false, message: "invalid credentials" })
        }

        // check password if user exists
        const password_compare = await bcrypt.compare(password, agency.password)
        if (!password_compare) {
            return res.status(400).json({ success: false, message: "invalid credentials" })
        }

        // if user is authenticated : generate an authentication token
        const auth_token = jwt.sign({
            user: {
                id: agency.id,
                type: "agency"
            }
        }, process.env.JWT_SECRET)

        return res.status(200).json({ success: true, auth_token: auth_token })

    } catch (error) {
        console.log('error -> ', error.message)
        return res.status(500).json({ error: "internal server error while log-in" })
    }
})

/* Route-3
Getting logged-in user details using: POST "/api/auth/getuser" 
Requires user authentication
*/
router.post('/getuser', fetchuser, async (req, res) => {
    try {

        // getting the user data from req.user as declared in fetchuser middleware
        const user_id = req.user.id
        const user_type = req.user.type

        let user

        if (user_type === 'student') {
            user = await Student.findById(user_id).select("-password")
        } else if (user_type === 'institution') {
            user = await Institution.findById(user_id).select("-password")
        } else {
            user = await Agency.findById(user_id).select("-password")
        }

        return res.status(200).json({ user_type: user_type, user: user })

    } catch (error) {
        console.log('error->', error.message)
        return res.status(500).json({ error: "internal server error getting user" })
    }
})

module.exports = router;