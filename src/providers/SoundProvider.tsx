"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load initial preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("soundEnabled");
    if (saved !== null) {
      setSoundEnabled(JSON.parse(saved));
    }
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const newState = !prev;
      localStorage.setItem("soundEnabled", JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSoundContext must be used within a SoundProvider");
  }
  return context;
}
