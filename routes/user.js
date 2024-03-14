const express = require('express');
const { getAllReferrals, createReferral, getUsers, getReferralsByUserId, changeReferralStatus } = require('../controllers/referals');

const router = express.Router();

router.post('/getAllReferals', getAllReferrals)
router.post('/createReferral', createReferral)
router.post('/getallusers', getUsers )
router.post('/getmyreferal', getReferralsByUserId )
router.post('/changeReferralStatus', changeReferralStatus )

module.exports = router