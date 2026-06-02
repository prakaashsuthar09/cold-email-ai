import { FiCopy, FiDownload, FiClock } from "react-icons/fi";

export default function HistoryPreview({ selectedEmail }) {
  return (
    <div className="flex-1 h-full overflow-hidden bg-[var(--bg-main)]">
      <div className="h-full flex flex-col">
        {/* FIXED HEADER */}
        <div className="sticky top-0 z-20 bg-[var(--bg-card)] border-b border-[var(--border-color)] px-8 py-5">
          <div className="flex items-center justify-between">
            {/* LEFT */}
            <div>
              <p className="text-[11px] uppercase tracking-[3px] text-[var(--text-secondary)] mb-1">
                Email History
              </p>

              <h1 className="text-2xl font-bold text-[var(--text-main)]">
                {selectedEmail?.title || "Untitled Email"}
              </h1>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2">
              <button className="px-4 items-center gap-1 text-sm font-medium text-[var(--text-main)]">
                <FiCopy size={16} />
              </button>

              <button className="px-3 items-center gap-1 text-sm font-medium text-[var(--text-main)]">
                <FiDownload size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-0">
          {/* EMAIL CONTAINER */}
          <div className="bg-[var(--bg-card)] min-h-full px-10 py-9">
            {/* HISTORY LABEL */}
            <div className="flex items-center gap-2 mb-12 text-lg text-[var(--text-main)]">
              <FiClock size={15} />
              <span>Previously Generated Email</span>
            </div>
            {/* EMAIL BODY */}
            <div className="whitespace-pre-wrap text-[16px] leading-[42px] text-[var(--text-secondary)] font-[450]">
              {selectedEmail?.generatedEmail}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
