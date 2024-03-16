const express = require('express');
const { getAllReferrals, createReferral, getUsers, getReferralsByUserId, changeReferralStatus, editStatus, getUserById, getUs } = require('../controllers/referals');

const router = express.Router();

router.post('/getAllReferals', getAllReferrals)
router.post('/createReferral', createReferral)
router.post('/getallusers', getUsers )
router.post('/getmyreferal', getReferralsByUserId )
router.post('/changeReferralStatus', changeReferralStatus )
router.post('/editstatus', editStatus )
router.post('/getUserById', getUserById )
router.post('/getUs', getUs )

getUs

module.exports = router