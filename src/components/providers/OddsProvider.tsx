"use client";
import { OddsContext, OddsContextType } from "../odds/OddsContext";
import { useOdds } from "../../hooks/useOdds";

export function OddsProvider({ children }: { children: React.ReactNode }) {
  const {
    sports,
    loading,
    fetchOdds,
    fetchScores,
    fetchEvents,
    fetchHistoricalOdds,
    fetchHistoricalEvents,
    fetchHistoricalEventOdds,
  } = useOdds();

  const value: OddsContextType = {
    sports,
    loading,
    fetchOdds,
    fetchScores,
    fetchEvents,
    fetchHistoricalOdds,
    fetchHistoricalEvents,
    fetchHistoricalEventOdds,
  };

  return <OddsContext.Provider value={value}>{children}</OddsContext.Provider>;
}
