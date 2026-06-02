const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // AI Generated Title
    title: {
      type: String,
      default: "",
    },

    fullName: String,

    purpose: String,

    tone: String,

    companyName: String,

    roleOrService: String,

    notes: String,

    generatedEmail: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Email",
  emailSchema
);