const Referral = require("../models/referalForm");
const User = require("../models/userModel");

const getAllReferrals = async (req, res) => {
  const { page, limit } = req.body; 

  // const page = parseInt(req.query.page) || 2;
  // const limit = parseInt(req.query.limit) || 10;

  try {
    const totalReferrals = await Referral.countDocuments();
    const totalPages = Math.ceil(totalReferrals / limit);

    const referrals = await Referral.find()
      .skip((page - 1) * limit)
      .limit(limit);
     console.log(referrals, page)
    res.status(200).json({
      totalReferrals,
      totalPages,
      currentPage: page,
      referrals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const createReferral = async (req, res) => {
  try {
      const { courseSuggestion, phoneNumber, email, byWhom } = req.body;
      console.log(byWhom)
      const user = await User.findById(byWhom);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      const newReferral = new Referral({
          friendName: user.name, // Use user's name as the referral name
          courseSuggestion,
          phoneNumber,
          email,
          byWhom
      });
      console.log(newReferral)
      await newReferral.save();

      // Update the user's referrals array with referral name and ID, and increment numberOfReferrals
      user.referrals.push({ referralId: newReferral._id, referralName: user.name });
      user.numberOfReferrals++;
      await user.save();

      res.status(201).json({ message: 'Referral created successfully', referral: newReferral });
  } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error)
  }
};


const getUsers = async (req, res) => {
  const { page, perPage, sortAscending } = req.body;
  console.log( page, perPage, sortAscending )
  try {
    const skip = (page-1)*perPage;
    const sortDirection = sortAscending ? 1 : -1;
    const users = await User.find()
      .skip(skip)
      .limit(perPage)
      .exec();

    const totalUsers = await User.countDocuments().exec();
    console.log(users)
    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / perPage)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getReferralsByUserId = async (req, res) => {
  try {
    const { userId, page = 1, limit = 10 } = req.body;
    console.log(userId)
    const skip = (page - 1) * limit;

    const user = await User.findById(userId); // Assuming User is your user model
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const referrals = await Referral.find({ byWhom: userId }).skip(skip).limit(limit);
    const totalReferrals = await Referral.countDocuments({ byWhom: userId });

    res.status(200).json({ user, referrals, totalReferrals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get referrals' });
  }
};



const changeReferralStatus = async (req, res) => {
  try {
      const { referralId, newStatus } = req.body;

      // Find the referral by ID
      const referral = await Referral.findById(referralId);

      // Check if the referral exists
      if (!referral) {
          return res.status(404).json({ message: 'Referral not found' });
      }

      // Update the status of the referral
      referral.status = newStatus;
      await referral.save();

      return res.status(200).json({ message: 'Referral status updated successfully' });
  } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
  }
};

const editStatus = async (req, res) => {
  const { courseEnrolled, userId } = req.body;
  console.log(courseEnrolled, userId);

  try {
    // Convert "Yes" to true and "No" to false
    const enrolled = courseEnrolled === 'Yes';
    console.log(enrolled)
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { courseEnrolled: enrolled },
      // { new: true } // To return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error editing user status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const getUserById = async (req, res) => {
  const { userId } = req.body;
   console.log(userId)
  try {
    const user = await Referral.findById(userId);
    console.log(user)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
const getUs = async (req, res) => {
  const { userId } = req.body;
   console.log(userId)
  try {
    const user = await User.findById(userId);
    console.log(user)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {
  getAllReferrals,
  createReferral,
  getUsers,
  getReferralsByUserId,
  changeReferralStatus,
  editStatus,
  getUserById,
  getUs
};
