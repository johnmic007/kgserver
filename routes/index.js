const express =require('express')
const authRouter = require('./auth')
const userAuth = require('./user')


const router =express.Router();


router.use('/auth', authRouter)
router.use('/user', userAuth )

module.exports = router;