import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

import EmailForm from "../components/EmailForm";

import EmailPreview from "../components/EmailPreview";

import HistoryPreview from "../components/HistoryPreview";

import { getHistory } from "../services/emailService";

export default function Dashboard() {
  const [open, setOpen] = useState(true);

  const [history, setHistory] = useState([]);

  const [selectedEmail, setSelectedEmail] = useState(null);

  const [generatedEmail, setGeneratedEmail] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getHistory();

      setHistory(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
    }
  }, []);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");

      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");

      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const [showForm, setShowForm] = useState(true);

  return (
    <div className="flex h-screen bg-[#020817] overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar
        open={open}
        setOpen={setOpen}
        history={history}
        setSelectedEmail={setSelectedEmail}
        setShowForm={setShowForm}
      />

      {/* RIGHT SECTION */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* PAGE CONTENT */}
        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-hidden bg-[#020617]">
          {showForm ? (
            <div className="flex h-full ">
              {/* EMAIL FORM */}
              <div className="w-[40%] min-w-[420px] overflow-y-auto">
                <EmailForm
                  setSelectedEmail={setSelectedEmail}
                  fetchHistory={fetchHistory}
                />
              </div>

              {/* INSTANT EMAIL PREVIEW */}
              <div className="flex-1 overflow-y-auto">
                <EmailPreview selectedEmail={selectedEmail} />
              </div>
            </div>
          ) : (
            /* HISTORY PREVIEW */
            <HistoryPreview selectedEmail={selectedEmail} />
          )}
        </div>
      </div>
    </div>
  );
}
