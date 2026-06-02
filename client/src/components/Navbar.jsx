import { useState } from "react";

import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";
export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <div
      className="
      h-[60px]
      bg-[var(--bg-sidebar)]
      border-b
      border-[var(--border-color)]
      flex
      items-center
      justify-between
      px-6
      sticky
      top-0
      z-90
    "
    >
      {/* LEFT */}
      <h1
        className="
        text-[var(--text-main)]
        text-xl
        font-semibold
      "
      >
        AI email
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* THEME TOGGLE */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="
          h-10
          w-10
          rounded-full
          bg-[var(--bg-card)]
          border
          border-[var(--border-color)]
          flex
          items-center
          justify-center
          text-[var(--text-main)]
          hover:bg-[var(--bg-input)]
          transition-colors
        "
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* LOGOUT BUTTON */}
        <button
          onClick={() => {
            localStorage.clear();

            window.location.href = "/";
          }}
          className="
          h-10
          w-10
          rounded-full
          hover:bg-[var(--bg-input)]
          duration-300
          flex
          items-center
          justify-center
          text-[var(--text-main)]
          border
          border-[var(--border-color)]
        "
        >
          <FiLogOut size={18} />
        </button>
      </div>
    </div>
  );
}
