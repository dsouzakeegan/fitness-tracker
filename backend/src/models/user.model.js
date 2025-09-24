const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
    {
        email: { type: String, unique: true, required: true, lowercase: true, trim: true },
        mobileNumber: { type: String, unique: true, required: false },
        role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
        hashPassword: { type: String, required: true },
        refreshToken: { type: String },
        firstname: { type: String }, 
        lastname: { type: String },
        isDeleted: { type: Boolean, default: false },
        stripeCustomerId: { type: String, default: null }
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;