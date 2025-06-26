"use client";
import { OddsEvent } from "@/types/game";
import { useOdds } from "../odds/OddsContext";
import { motion } from "framer-motion";
import _ from "lodash";
import { useState } from "react";

export default function OddsList() {
  const { sports, loading, fetchOdds } = useOdds();
  const [selectedOdds, setSelectedOdds] = useState<OddsEvent[]>([]);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [oddsLoading, setOddsLoading] = useState(false);

  if (loading) return <div>Carregando esportes...</div>;

  const sorted = _.sortBy(sports, "title");

  const handleSportClick = async (sportKey: string) => {
    setOddsLoading(true);
    setSelectedSport(sportKey);
    const odds = await fetchOdds(sportKey);
    setSelectedOdds(odds);
    setOddsLoading(false);
  };

  return (
    <div className="space-y-4">
      <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {sorted.map((sport) => (
          <li
            key={sport.key}
            className="p-2 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => handleSportClick(sport.key)}
          >
            {sport.title}
          </li>
        ))}
      </motion.ul>
      {oddsLoading && <div>Carregando odds...</div>}
      {selectedOdds.length > 0 && (
        <div className="mt-4">
          <h2 className="font-bold">Odds para {selectedSport}</h2>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(selectedOdds, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
