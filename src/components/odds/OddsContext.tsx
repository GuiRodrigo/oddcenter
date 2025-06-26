import { OddsEvent, OddsSport } from "@/types/game";
import { createContext, useContext } from "react";

export type OddsContextType = {
  sports: OddsSport[];
  loading: boolean;
  fetchOdds: (sportKey: string) => Promise<OddsEvent[]>;
};

export const OddsContext = createContext<OddsContextType | undefined>(
  undefined
);

export function useOdds() {
  const ctx = useContext(OddsContext);
  if (!ctx) throw new Error("useOdds deve ser usado dentro de OddsProvider");
  return ctx;
}
