import { OddsEvent, OddsSport } from "@/types/game";
import { createContext, useContext } from "react";
import { Event } from "../games/EventsList";
import { ScoreEvent } from "../games/ScoresList";

export type OddsContextType = {
  sports: OddsSport[];
  loading: boolean;
  fetchOdds: (
    sportKey: string,
    options?: {
      regions?: string;
      markets?: string;
      oddsFormat?: "american" | "decimal" | "hongkong" | "indonesian" | "malay";
      dateFormat?: "iso" | "unix";
    }
  ) => Promise<OddsEvent[]>;
  fetchScores: (
    sportKey: string,
    options?: {
      dateFormat?: "iso" | "unix";
    }
  ) => Promise<ScoreEvent[]>;
  fetchEvents: (
    sportKey: string,
    options?: {
      dateFormat?: "iso" | "unix";
    }
  ) => Promise<Event[]>;
  fetchHistoricalOdds: (
    sportKey: string,
    date: string,
    options?: {
      regions?: string;
      markets?: string;
      oddsFormat?: "american" | "decimal" | "hongkong" | "indonesian" | "malay";
      dateFormat?: "iso" | "unix";
    }
  ) => Promise<unknown[]>;
  fetchHistoricalEvents: (
    sportKey: string,
    date: string,
    options?: {
      dateFormat?: "iso" | "unix";
    }
  ) => Promise<unknown[]>;
  fetchHistoricalEventOdds: (
    eventId: string,
    options?: {
      regions?: string;
      markets?: string;
      oddsFormat?: "american" | "decimal" | "hongkong" | "indonesian" | "malay";
      dateFormat?: "iso" | "unix";
    }
  ) => Promise<unknown[]>;
};

export const OddsContext = createContext<OddsContextType | undefined>(
  undefined
);

export function useOdds() {
  const ctx = useContext(OddsContext);
  if (!ctx) throw new Error("useOdds deve ser usado dentro de OddsProvider");
  return ctx;
}
