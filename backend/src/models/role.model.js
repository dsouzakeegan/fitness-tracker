const mongoose = require("mongoose");

const RoleSchema = mongoose.Schema(
    {
        title: { type: String, unique: true, required: true, lowercase: true, trim: true },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const Role = mongoose.model("Role", RoleSchema);

module.exports = Role;