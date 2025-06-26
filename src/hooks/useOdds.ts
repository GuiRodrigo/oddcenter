import { OddsSport } from "@/types/game";
import { useState, useEffect, useCallback } from "react";

export function useOdds() {
    const [sports, setSports] = useState<OddsSport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch("/api/oddsApi")
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setSports(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const fetchOdds = useCallback(async (sportKey: string) => {
        const res = await fetch(`/api/oddsApi?type=odds&sportKey=${sportKey}`);
        console.log(res)
        if (!res.ok) return [];
        return res.json();
    }, []);

    return {
        sports,
        loading,
        fetchOdds,
    };
} 