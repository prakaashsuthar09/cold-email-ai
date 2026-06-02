import { useEffect, useState } from "react";

import { FiMenu, FiPlus, FiClock, FiMail } from "react-icons/fi";

import axios from "axios";

export default function Sidebar({
  open,
  setOpen,
  history,
  setSelectedEmail,
  setShowForm,
}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me");

        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div
      className={`
      h-screen
      bg-[var(--bg-sidebar)]
      border-r border-[var(--border-color)]
      transition-all duration-100
      flex flex-col  justify-between
      ${open ? "w-[260px]" : "w-[70px]"}
    `}
    >
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* TOP HEADER */}
        <div
          className={`
            h-[70px]
            px-2
            flex
            items-center
            ${open ? "justify-between" : "justify-center"}
            shrink-0
          `}
        >
          {/* LOGO text */}
          {open && (
            <div>
              <h1 className="text-[var(--text-main)] text-xl font-bold tracking-wide">
                MAIL
              </h1>
            </div>
          )}

          {/* MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="
              h-[45px]  w-10
              rounded-2xl
              bg-[var(--bg-card)]
              hover:bg-[var(--bg-input)]
              transition-all
              flex items-center justify-center
              text-[var(--text-main)]
              border border-[var(--border-color)]
            "
          >
            <FiMenu size={20} />
          </button>
        </div>

        {/* MENU BUTTONS */}
        <div className="px-3 mt-4 space-y-3">
          {/* NEW EMAIL */}
          <button
            onClick={() => {
              setSelectedEmail(null);
              setShowForm(true);
            }}
            className="
              w-full
              h-[45px]
              rounded-2xl
              bg-transparent
              hover:bg-[var(--bg-input)]
              text-[var(--text-main)]
              border border-[var(--border-color)]
              flex items-center
              transition-all
            "
          >
            <div className="w-[60px] flex justify-center">
              <FiPlus size={20} />
            </div>

            {open && <span className="font-medium text-[15px]">New Email</span>}
          </button>
        </div>

        {/* RECENT EMAILS */}
        {open && (
          <div
            className="
              sticky top-0 z-20
              bg-[var(--bg-sidebar)]
              px-4 pb-4
            "
          >
            <div className="flex items-center justify-between border-b border-[var(--border-color)]
              pb-3 mb-3 mt-4">
              <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                Recent
              </p>

              <p className="text-xs font-medium text-[var(--text-main)]">
                {history.length}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
              {history.map((item) => (
                <button
                  key={item._id}
                  onClick={() => {
                    setSelectedEmail(item);
                    setShowForm(false);
                  }}
                  className="
                    w-full
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2.5
                    rounded-xl
                    hover:bg-[var(--bg-input)]
                    transition-all
                    text-left
                    group
                  "
                >
                  <FiMail
                    size={16}
                    className="
                      shrink-0
                      text-[var(--text-main)]
                      opacity-70
                    "
                  />

                  <span
                    className="
                      text-sm
                      text-[var(--text-main)]
                      truncate
                      font-medium
                    "
                  >
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PROFILE SECTION */}
      <div
        className="
          p-3
          pb-4
          shrink-0
        "
      >
        <button
          className={`
            w-full
            flex
            items-center
            rounded-2xl
            transition-all
            ${open ? "gap-3 p-1 justify-start" : "justify-center p-1 h-10"}
         `}
        >
          {/* PROFILE IMAGE */}

          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="profile"
              className="
              h-6
              w-6
              rounded-full
              object-cover
              shrink-0
            "
            />
          ) : (
            <div
              className="
                h-6
                w-6
                rounded-full
                bg-[var(--primary)]
                flex
                items-center
                justify-center
                text-[10px]
                text-[var(--text-primary)]
                font-bold
                font-monrope
                shrink-0
              "
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* NAME + EMAIL */}

          {open && user && (
            <div className="min-w-0 text-left">
              <h3
                className="
                  text-sm
                  font-medium
                  truncate
                  text-[var(--text-main)]
                "
              >
                {user.name}
              </h3>

              <p
                className="
                  text-xs
                  truncate
                  text-[var(--text-secondary)]
                "
              >
                {user.email}
              </p>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
