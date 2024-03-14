const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    batch: { type: Number, required: true },
    city: { type: String },
    course: { type: String },
    courseEnrolled: { type: Boolean, default: false }, // Default to false
    role: { type: String, default: 'user' },
    password: { type: String, required: true },
    referrals: [{
        referralId: { type: Schema.Types.ObjectId, ref: 'Referral' },
        referralName: { type: String }
    }],
    numberOfReferrals: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
