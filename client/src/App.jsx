import AppRoutes from "./routes/AppRoutes";

import { useEffect, useState } from "react";

import axios from "axios";

axios.defaults.withCredentials = true;

function App() {

  const [darkMode, setDarkMode] =
    useState(true);

  useEffect(() => {

    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "light") {

      document.documentElement
        .classList.remove("dark");

      setDarkMode(false);

    } else {

      document.documentElement
        .classList.add("dark");

      setDarkMode(true);
    }

  }, []);

  // GOOGLE TOKEN SAVE
  useEffect(() => {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const token =
      params.get("token");

    if (token) {

      localStorage.setItem(
        "token",
        token
      );
    }

  }, []);

  const toggleTheme = () => {

    if (darkMode) {

      document.documentElement
        .classList.remove("dark");

      localStorage.setItem(
        "theme",
        "light"
      );

    } else {

      document.documentElement
        .classList.add("dark");

      localStorage.setItem(
        "theme",
        "dark"
      );
    }

    setDarkMode(!darkMode);
  };

  return <AppRoutes />;
}

export default App;