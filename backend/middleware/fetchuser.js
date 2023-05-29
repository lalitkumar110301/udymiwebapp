var jwt = require('jsonwebtoken')

const fetchuser = (req, res, next) => {

    // get auth_token from the header
    const auth_token = req.header('auth-token')
    if (!auth_token) {
        return res.status(401).json({ error: "invalid authentication token" })
    }

    try {

        // extract user data from the auth_token
        const data = jwt.verify(auth_token, process.env.JWT_SECRET)
        req.user = data.user

        // execute the next function after the fetchuser middleware
        next()

    } catch (error) {
        res.status(500).json({ error: "verification failed" })
    }
}

module.exports = fetchuser;