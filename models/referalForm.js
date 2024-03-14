const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const referralSchema = new Schema({
    friendName: { type: String },
    courseSuggestion: { type: String},
    phoneNumber: { type: String },
    email: { type: String, unique: true },
    byWhom: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['received', 'converted', 'success', 'failure'], default: 'received' }
});

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
