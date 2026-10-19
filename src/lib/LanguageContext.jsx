"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
  isChosen: false,
  setChosen: () => {},
});

const COOKIE_NAME = "NEXT_LOCALE";
const STORAGE_KEY = "aura_solar_locale";
const CHOSEN_KEY = "aura_solar_lang_chosen";

export function LanguageProvider({ children, initialLanguage = "en", initialChosen = false }) {
  const [language, setLanguageState] = useState(initialLanguage);
  const [isChosen, setIsChosen] = useState(initialChosen);

  useEffect(() => {
    // Check localStorage / cookie on client mount
    try {
      const storedChosen = localStorage.getItem(CHOSEN_KEY);
      const storedLang = localStorage.getItem(STORAGE_KEY);

      if (storedChosen === "true") {
        setIsChosen(true);
      } else {
        // Check if cookie exists
        const match = document.cookie.match(new RegExp("(^| )" + COOKIE_NAME + "=([^;]+)"));
        if (match && (match[2] === "en" || match[2] === "hi")) {
          setIsChosen(true);
        } else {
          setIsChosen(false);
        }
      }

      if (storedLang === "en" || storedLang === "hi") {
        setLanguageState(storedLang);
      }
    } catch {
      // Fallback gracefully if storage blocked
      setIsChosen(true);
    }
  }, []);

  const setLanguage = (newLang) => {
    if (newLang !== "en" && newLang !== "hi") return;
    setLanguageState(newLang);
    setIsChosen(true);

    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      localStorage.setItem(CHOSEN_KEY, "true");
      // Persist in cookie for 1 year
      document.cookie = `${COOKIE_NAME}=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
      // Update HTML lang attribute
      if (typeof document !== "undefined") {
        document.documentElement.lang = newLang;
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  };

  const setChosen = (chosenStatus) => {
    setIsChosen(chosenStatus);
    try {
      localStorage.setItem(CHOSEN_KEY, chosenStatus ? "true" : "false");
    } catch {
      // Ignore
    }
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isChosen,
        setChosen,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
