export const buildPrompt = ({
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
}) => {
  return `
  You are an expert professional email writer.
Write naturally as a human professional would write.
Do not sound like an AI assistant.

Generate ALL THREE sections:

TITLE:
(A short smart title for email history, maximum 3-6 words)

SUBJECT:
(A professional email subject line)

BODY:
(The complete email body)

Return ONLY in this exact format:

TITLE: ...

SUBJECT: ...

BODY:
...

Avoid phrases such as:
"I hope this email finds you well"
unless it naturally fits the context.



CONTEXT
---------
Full Name: ${fullName}
Purpose: ${purpose}
Student Purpose: ${studentSubPurpose}
Tone: ${tone}
Company: ${companyName}
Role/Service: ${roleOrService}
User Type: ${userMode}
Leave Reason: ${leaveReason}
Other Reason: ${otherReason}
Start Date: ${selectedDate}
End Date: ${endDate}
Date Mode: ${dateMode}
Additional Notes: ${notes}

WRITING RULES
---------
- Write like an experienced professional, not an AI.
- Use natural language and realistic wording.
- Avoid generic phrases and repetition.
- Create a strong, relevant subject line.
- Use proper greeting and closing.
- Organize the email into readable paragraphs.
- Include all relevant details naturally.
- If dates are provided, reference them appropriately.
- If leave reason is provided, mention it professionally.
- Keep the email concise but complete.
- Make it ready to send without editing.


Examples:

TITLE: Internship Application
SUBJECT: Application for Frontend Developer Internship

TITLE: Medical Leave Request
SUBJECT: Request for Medical Leave

TITLE: Course Guidance Request
SUBJECT: Seeking Guidance Regarding Course Selection

BODY should contain only the email content.
End with:

Best Regards,
${fullName}
`;
};