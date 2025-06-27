"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Tipo do contexto
interface SportContextType {
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
}

const SportContext = createContext<SportContextType | undefined>(undefined);

export const SportProvider = ({ children }: { children: ReactNode }) => {
  // Persistência opcional com localStorage
  const [selectedSport, setSelectedSport] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("selectedSport") || "soccer_brazil_campeonato"
      );
    }
    return "soccer_brazil_campeonato";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedSport", selectedSport);
    }
  }, [selectedSport]);

  return (
    <SportContext.Provider value={{ selectedSport, setSelectedSport }}>
      {children}
    </SportContext.Provider>
  );
};

export const useSport = () => {
  const context = useContext(SportContext);
  if (!context) {
    throw new Error("useSport deve ser usado dentro de um SportProvider");
  }
  return context;
};
