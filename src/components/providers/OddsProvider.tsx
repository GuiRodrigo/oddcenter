"use client";
import { OddsContext, OddsContextType } from "../odds/OddsContext";
import { useOdds } from "../../hooks/useOdds";

export function OddsProvider({ children }: { children: React.ReactNode }) {
  const { sports, loading, fetchOdds } = useOdds();

  const value: OddsContextType = {
    sports,
    loading,
    fetchOdds,
  };

  return <OddsContext.Provider value={value}>{children}</OddsContext.Provider>;
}
