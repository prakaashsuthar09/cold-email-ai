const generateEmail = require("../services/aiService");
const Email = require("../models/Email");
const { buildPrompt } = require("../utils/promptBuilder");

// GENERATE EMAIL
exports.generateAIEmail = async (req, res) => {
  try {
    const {
      fullName,
      purpose,
      tone,
      companyName,
      roleOrService,
      notes,
      selectedDate,
      endDate,
      dateMode,
      studentSubPurpose,
      userMode,
      leaveReason,
      otherReason,
    } = req.body;

    // BUILD AI PROMPT
    const prompt = buildPrompt({
      fullName,
      purpose,
      tone,
      companyName,
      roleOrService,
      notes,
      selectedDate,
      endDate,
      dateMode,
      studentSubPurpose,
      userMode,
      leaveReason,
      otherReason,
    });

    // AI RESPONSE
    const aiResponse = await generateEmail(prompt);

    /*
      Expected Format:

      TITLE: Internship Request at Deloitte

      SUBJECT: Application for Frontend Developer Internship

      BODY:
      Dear Hiring Team...
    */

    const titleMatch =
      aiResponse.match(/TITLE:(.*)/i);

    const subjectMatch =
      aiResponse.match(/SUBJECT:(.*)/i);

    const bodyMatch =
      aiResponse.match(/BODY:([\s\S]*)/i);

    const title =
      titleMatch?.[1]?.trim() ||
      `${purpose}`;

    const subject =
      subjectMatch?.[1]?.trim() ||
      `${purpose}`;

    const generatedEmail =
      bodyMatch?.[1]?.trim() ||
      aiResponse;

    // SAVE DATABASE
    const email = await Email.create({
      user: req.user.id,

      title,

      subject,

      fullName,

      purpose,

      tone,

      companyName,

      roleOrService,

      notes,

      generatedEmail,
    });

    res.status(200).json({
      success: true,
      email,
    });

  } catch (error) {

    console.log("EMAIL ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET EMAIL HISTORY
exports.getEmailHistory = async (req, res) => {
  try {

    const emails = await Email.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(emails);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};