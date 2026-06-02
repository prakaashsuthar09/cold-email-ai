import { FiRefreshCw, FiDownload, FiMail } from "react-icons/fi";
import { FaWhatsapp, FaGoogle } from "react-icons/fa";
import jsPDF from "jspdf";

export default function EmailPreview({ selectedEmail }) {
  // GMAIL
  const handleGmail = () => {
    const subject = encodeURIComponent(selectedEmail?.title || "");

    const body = encodeURIComponent(selectedEmail?.generatedEmail || "");

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`,
      "_blank",
    );
  };

  // WHATSAPP
  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `${selectedEmail?.title}\n\n${selectedEmail?.generatedEmail}`,
    );

    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  // PDF DOWNLOAD
  const handleDownloadPDF = () => {
  const doc = new jsPDF();

  doc.setFont("helvetica", "normal");

  doc.setFontSize(18);
  doc.text(selectedEmail.title, 20, 20);

  doc.setLineWidth(0.3);
  doc.line(20, 25, 190, 25);

  doc.setFontSize(11);

  const body = doc.splitTextToSize(
    selectedEmail.generatedEmail,
    170
  );

  doc.text(body, 20, 35);

  doc.save(`${selectedEmail.title}.pdf`);
};

  return (
    <div className="flex-1 h-full overflow-hidden bg-[var(--bg-main)]">
      {selectedEmail ? (
        <div className="h-full flex flex-col">
          {/* FIXED HEADER */}
          <div className="sticky top-0 z-20 bg-[var(--bg-card)] border-b border-[var(--border-color)] px-8 py-5">
            <div className="flex items-center justify-between">
              {/* LEFT */}
              <div>
                <p className="text-[11px] uppercase tracking-[3px] text-[var(--text-secondary)] mb-1">
                  Generated Email
                </p>

                <h1 className="text-2xl font-bold text-[var(--text-main)]">
                  {selectedEmail?.title || "Untitled Email"}
                </h1>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGmail}
                  className="
                    h-10 w-10
                    rounded-xl
                    border border-[var(--border-color)]
                    hover:bg-[var(--hover-bg)]
                    transition-all
                    flex items-center justify-center
                  "
                >
                  <FaGoogle size={16} />
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="
                    h-10 w-10
                    rounded-xl
                    border border-[var(--border-color)]
                    hover:bg-[var(--hover-bg)]
                    transition-all
                    flex items-center justify-center
                  "
                >
                  <FaWhatsapp size={17} />
                </button>

                <button
                  onClick={handlePDF}
                  className="
                    h-10 w-10
                    rounded-xl
                    border border-[var(--border-color)]
                    hover:bg-[var(--hover-bg)]
                    transition-all
                    flex items-center justify-center
                  "
                >
                  <FiDownload size={16} />
                </button>

                <button
                  className="
                    h-10 px-4
                    rounded-xl
                    bg-gradient-to-r
                    from-violet-600
                    to-purple-600
                    text-white
                    flex items-center gap-2
                    hover:scale-105
                    transition-all
                  "
                >
                  <FiRefreshCw size={15} />
                  Regenerate
                </button>
              </div>
            </div>
          </div>

          {/* EMAIL BODY */}
          <div className="flex-1 overflow-y-auto p-0">
            {/* EMAIL CONTAINER */}
            <div className="bg-[var(--bg-card)] min-h-full px-10 py-12">
              {/* EMAIL TEXT */}
              <div className="whitespace-pre-wrap text-[16px] leading-[42px] text-[var(--text-secondary)] font-[450]">
                {selectedEmail?.generatedEmail}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-xl">
            <div className="flex items-center justify-center mx-auto mb-2 ">
              <FiMail size={22} className="text-[var(--text-secondary)]" />
            </div>

            <h1 className="text-2xl font-bold text-[var(--text-main)]">
              AI Email Generator
            </h1>

            <p className="justify-center text-[var(--text-secondary)] text-[15px] leading-8">
              Generate professional AI-powered emails instantly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
