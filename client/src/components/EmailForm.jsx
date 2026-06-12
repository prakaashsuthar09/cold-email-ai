import { useState } from "react";

import { useRef } from "react";

import { FiSend, FiLoader, FiMail } from "react-icons/fi";

import { toast } from "react-hot-toast";

import DatePicker from "react-datepicker";

import { generateEmail } from "../services/emailService";

const PURPOSES = ["Job", "Sales", "Freelancing", "Student"];

const STUDENT_SUB_PURPOSES = [
  "Leave Application",
  "Sick Leave",
  "Exam Leave",
  "Fee Extension Request",
  "Internship Request",
];

const USER_MODES = [
  {
    label: "Student",
    value: "Student",
  },

  {
    label: "Employee",
    value: "Employee",
  },

  {
    label: "Teacher",
    value: "Teacher",
  },
];

const LEAVE_REASONS = [
  "Medical Issue",

  "Family Emergency",

  "Personal Work",

  "Festival",

  "Travel",

  "Mental Health",

  "Other",
];

export default function EmailForm({ fetchHistory, setSelectedEmail }) {
  const [formData, setFormData] = useState({
    fullName: "",
    purpose: "",
    tone: "",
    companyName: "",
    roleOrService: "",
    notes: "",
  });

  const [studentSubPurpose, setStudentSubPurpose] = useState("");

  const [userMode, setUserMode] = useState("");

  const [leaveReason, setLeaveReason] = useState("");

  const [otherReason, setOtherReason] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const [dateMode, setDateMode] = useState("single");

  const isStudent = formData.purpose === "Student";

  const isLeaveType = studentSubPurpose.includes("Leave");

  const needsOtherReason = leaveReason === "Other";

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const textareaRef = useRef(null);

  const handleTextareaInput = (e) => {
    e.target.style.height = "auto";

    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("SUBMIT CLICKED");

    const isLeaveType = studentSubPurpose.includes("Leave");

    if (!formData.fullName || !formData.purpose) {
      toast.error("Fill required fields");
      return;
    }

    // COMPANY REQUIRED ONLY FOR PROFESSIONAL EMAILS
    if (!isLeaveType && !formData.companyName) {
      toast.error("Company name required");
      return;
    }

    // ROLE REQUIRED ONLY FOR PROFESSIONAL EMAILS
    if (!isLeaveType && !formData.roleOrService) {
      toast.error("Role/service required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,

        studentSubPurpose,

        userMode,

        leaveReason,

        otherReason,

        selectedDate,

        endDate,

        dateMode,
      };

      const res = await generateEmail(payload);

      // EMAIL PREVIEW
      setSelectedEmail(res.data.email);

      // REFRESH HISTORY
      fetchHistory();

      toast.success("Email generated successfully");

      // RESET
      setFormData({
        fullName: "",
        purpose: "",
        tone: "",
        companyName: "",
        roleOrService: "",
        notes: "",
      });
    } catch (error) {
      console.log(error);

      toast.error("Email generation failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-full bg-[var(--bg-main)] border-r border-[var(--border-color)]">
      {/* MAIN FORM CARD */}
      <div
        className="
          h-full
          bg-[var(--bg-card)]
          overflow-hidden
          flex
          flex-col
        "
      >
        {/* HEADER */}
        <div
          className="
          px-6
          py-4
          bg-transparent
          backdrop-blur-2xl
          flex
          items-center
          gap-2
          flex-shrink-0
        "
        >
          <FiMail className="text-[var(--text-main)] h-4 w-5 text-lg" />

          <h1 className="text-[var(--text-main)] text-[15px] font-bold leading-5">
            Email Details
          </h1>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden pr-2"
        >
          {/* SCROLLABLE FORM AREA */}
          <div
            className="
            flex-1
            overflow-y-auto
            px-6
            py-6
            space-y-5
            scrollbar-thin
          "
          >
            {/* FULL NAME */}
            <div className="space-y-2">
              <label className="text-sm text-[var(--text-secondary)] font-medium">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="
                w-full
                h-10
                rounded-2xl
                bg-[var(--bg-input)]
                border
                border-[var(--border-color)]
                px-4
                text-[var(--text-main)]
                placeholder:text-[var(--text-secondary)]
                outline-none
                focus:border-indigo-500
                transition-all
              "
              />
            </div>

            {/* COMPANY */}
            <div className="space-y-2">
              <label className="text-sm text-[var(--text-secondary)] font-medium">
                Company Name
              </label>

              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Acme Inc."
                className="
                w-full
                h-10
                rounded-2xl
                bg-[var(--bg-input)]
                border
                border-[var(--border-color)]
                px-4
                text-[var(--text-main)]
                placeholder:text-[var(--text-secondary)]
                outline-none
                focus:border-indigo-500
              "
              />
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TONE */}
              <div className="space-y-2">
                <label className="text-sm text-[var(--text-secondary)] font-medium">
                  Tone
                </label>

                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="
                  w-full
                  h-10
                  rounded-2xl
                  bg-[var(--bg-input)]
                  border
                  border-[var(--border-color)]
                  px-4
                  text-[var(--text-main)]
                  outline-none
                  focus:border-indigo-500
                "
                >
                  <option value="">Select Tone</option>

                  <option value="Professional">Professional</option>

                  <option value="Friendly">Friendly</option>

                  <option value="Formal">Formal</option>

                  <option value="Respectful">Respectful</option>
                </select>
              </div>

              {/* PURPOSE */}
              <div className="space-y-2">
                <label className="text-sm text-[var(--text-secondary)] font-medium">
                  Purpose
                </label>

                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="
                  w-full
                  h-10
                  rounded-2xl
                  bg-[var(--bg-input)]
                  border
                  border-[var(--border-color)]
                  px-4
                  text-[var(--text-main)]
                  outline-none
                  focus:border-indigo-500
                "
                >
                  <option value="">Select Purpose</option>

                  {PURPOSES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ROLE */}
            <div className="space-y-2">
              <label className="text-sm text-[var(--text-secondary)] font-medium">
                Role / Service
              </label>

              <input
                type="text"
                name="roleOrService"
                value={formData.roleOrService}
                onChange={handleChange}
                placeholder="Frontend Developer"
                className="
                w-full
                h-10
                rounded-2xl
                bg-[var(--bg-input)]
                border
                border-[var(--border-color)]
                px-4
                text-[var(--text-main)]
                placeholder:text-[var(--text-secondary)]
                outline-none
                focus:border-indigo-500
              "
              />
            </div>

            {/* DATE SECTION */}
            <div className="space-y-4">
              {/* TOP */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-[var(--text-secondary)] font-medium">
                  Select Date
                </label>

                {/* MODE SWITCH */}
                <div
                  className="
                  flex
                  items-center
                  bg-[var(--bg-input)]
                  border
                  border-[var(--border-color)]
                  rounded-2xl
                  p-1
                "
                >
                  <button
                    type="button"
                    onClick={() => setDateMode("single")}
                    className={`
                    px-3
                    py-1.5
                    rounded-[12px]
                    text-sm
                    transition-all
                    ${
                      dateMode === "single"
                        ? "bg-[var(--primary)] text-[var(--text-primary)] "
                        : "text-[var(--text-secondary)]"
                    }
                  `}
                  >
                    Single
                  </button>

                  <button
                    type="button"
                    onClick={() => setDateMode("range")}
                    className={`
                    px-3
                    py-1.5
                    rounded-[12px]
                    text-sm
                    transition-all
                    ${
                      dateMode === "range"
                        ? "bg-[var(--primary)] text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)]"
                    }
                  `}
                  >
                    Range
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* START DATE */}
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  placeholderText="Select Date"
                  className="
                w-full
                h-10
                rounded-2xl
                bg-[var(--bg-input)]
                border
                border-[var(--border-color)]
                px-4
                text-[var(--text-main)]
                outline-none
                focus:border-indigo-500
              "
                />

                {/* END DATE */}
                {dateMode === "range" && (
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    minDate={selectedDate}
                    placeholderText="End Date"
                    className="
                  w-full
                  h-10
                  rounded-2xl
                  bg-[var(--bg-input)]
                  border
                  border-[var(--border-color)]
                  px-4
                  text-[var(--text-main)]
                  outline-none
                  focus:border-indigo-500
                "
                  />
                )}
              </div>
            </div>

            {/* STUDENT PURPOSE */}
            {isStudent && (
              <div className="space-y-2">
                <label className="text-sm text-[var(--text-secondary)] font-medium">
                  Email Type
                </label>

                <select
                  value={studentSubPurpose}
                  onChange={(e) => setStudentSubPurpose(e.target.value)}
                  className="
                  w-full
                  h-10
                  rounded-2xl
                  bg-[var(--bg-input)]
                  border
                  border-[var(--border-color)]
                  px-4
                  text-[var(--text-main)]
                "
                >
                  <option value="">Select Email Type</option>

                  {STUDENT_SUB_PURPOSES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* USER MODE */}
            {isLeaveType && (
              <div className="space-y-2">
                <label className="text-sm text-[var(--text-secondary)] font-medium">
                  User Mode
                </label>

                <select
                  value={userMode}
                  onChange={(e) => setUserMode(e.target.value)}
                  className="
                  w-full
                  h-10
                  rounded-2xl
                  bg-[var(--bg-input)]
                  border
                  border-[var(--border-color)]
                  px-4
                  text-[var(--text-main)]
                "
                >
                  <option value="">Select User Mode</option>

                  {USER_MODES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* LEAVE REASON */}
            {isLeaveType && (
              <div className="space-y-2">
                <label className="text-sm text-[var(--text-secondary)] font-medium">
                  Leave Reason
                </label>

                <select
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="
                  w-full
                  h-10
                  rounded-2xl
                  bg-[var(--bg-input)]
                  border
                  border-[var(--border-color)]
                  px-4
                  text-[var(--text-main)]
                "
                >
                  <option value="">Select Reason</option>

                  {LEAVE_REASONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* OTHER REASON */}
            {needsOtherReason && (
              <div className="space-y-2">
                <label className="text-sm text-[var(--text-secondary)] font-medium">
                  Other Reason
                </label>

                <input
                  type="text"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="Enter reason"
                  className="
                  w-full
                  h-10
                  rounded-2xl
                  bg-[var(--bg-input)]
                  border
                  border-[var(--border-color)]
                  px-4
                  text-[var(--text-main)]
                "
                />
              </div>
            )}
          </div>

          {/* FIXED CHATGPT STYLE TEXTAREA */}
          <div
            className="
            border-gray-800
            mb-2
            p-2
            px-5
            bg-transparent
            shrink-0
          "
          >
            <div
              className="
              relative
              rounded-3xl
              pr-10
              border
              border-gray-700
              bg-[var(--bg-input)]
              overflow-hidden
              transition-all
              focus-within:border-indigo-500
              focus-within:shadow-[0_0_10px_rgba(99,102,241,0.2)]
            "
            >
              {/* TEXTAREA */}
              <textarea
                ref={textareaRef}
                name="notes"
                value={formData.notes}
                rows={1}
                onChange={(e) => {
                  handleChange(e);
                  handleTextareaInput(e);
                }}
                placeholder="Additional Notes..."
                className="
                w-full
                bg-[var(--bg-input)]
                text-[var(--text-main)]
                placeholder:text-[var(--text-secondary)]
                px-5
                py-2
                pr-1
                outline-none
                resize-none
                max-h-[180px]
                overflow-y-auto
              "
              />

              {/* SEND BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="
                absolute
                bottom-1.5
                right-1.5
                h-9
                w-9
                rounded-3xl
                bg-[var(--primary)]
                text-[var(--text-primary)]
                flex
                items-center
                justify-center
                shadow-[0_0_25px_rgba(99,102,241,0.45)]
                transition-all
                disabled:opacity-50
              "
              >
                {loading ? (
                  <FiLoader size={16} className="animate-spin" />
                ) : (
                  <FiSend size={15} />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
