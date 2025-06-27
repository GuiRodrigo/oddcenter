"use client"

import type { OddsSport, OddsEvent } from "@/types/game"
import { useState, useEffect, useCallback } from "react"
import { intelligentCache } from "@/lib/cache"

export function useOdds() {
    const [sports, setSports] = useState<OddsSport[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadSports = async () => {
            setLoading(true)

            // Verificar cache primeiro
            const cacheKey = "sports_list"
            if (intelligentCache.shouldUseCache(cacheKey)) {
                const cached = intelligentCache.get<OddsSport[]>(cacheKey)
                if (cached) {
                    setSports(cached)
                    setLoading(false)
                    return
                }
            }

            try {
                const res = await fetch("/api/oddsApi")

                if (!res.ok) {
                    setLoading(false)
                    return
                }

                const contentType = res.headers.get("content-type")
                if (!contentType?.includes("application/json")) {
                    setLoading(false)
                    return
                }

                const data = await res.json()
                setSports(data)

                // Armazenar no cache
                intelligentCache.set(cacheKey, data)

                // Atualizar informações de quota
                intelligentCache.updateQuota(res.headers)

                setLoading(false)
            } catch (error) {
                console.error("Erro ao carregar esportes:", error)
                setLoading(false)
            }
        }

        loadSports()
    }, [])

    const fetchOdds = useCallback(
        async (
            sportKey: string,
            options?: {
                regions?: string
                markets?: string
                oddsFormat?: "american" | "decimal" | "hongkong" | "indonesian" | "malay"
                dateFormat?: "iso" | "unix"
            },
        ) => {
            const cacheKey = `odds_${sportKey}_${JSON.stringify(options)}`

            // Verificar cache primeiro
            if (intelligentCache.shouldUseCache(cacheKey)) {
                const cached = intelligentCache.get<OddsEvent[]>(cacheKey)
                if (cached) return cached
            }

            // Função para determinar mercados apropriados por esporte
            const getAppropriateMarkets = (sportKey: string, requestedMarkets: string): string => {
                const noH2HSports = ["golf", "tennis", "mma", "boxing", "outrights"]

                if (noH2HSports.some((sport) => sportKey.toLowerCase().includes(sport))) {
                    if (requestedMarkets.includes("h2h")) {
                        return "outrights"
                    }
                }

                return requestedMarkets
            }

            const defaultMarkets = options?.markets || "h2h"
            const appropriateMarkets = getAppropriateMarkets(sportKey, defaultMarkets)

            const params = new URLSearchParams({
                type: "odds",
                sportKey,
                regions: options?.regions || "us,eu,uk",
                markets: appropriateMarkets,
                oddsFormat: options?.oddsFormat || "decimal",
                dateFormat: options?.dateFormat || "iso",
            })

            try {
                const res = await fetch(`/api/oddsApi?${params}`)

                if (!res.ok) {
                    return []
                }

                const contentType = res.headers.get("content-type")
                if (!contentType?.includes("application/json")) {
                    return []
                }

                const data = await res.json()

                // Armazenar no cache
                intelligentCache.set(cacheKey, data)

                // Atualizar informações de quota
                intelligentCache.updateQuota(res.headers)

                return data as OddsEvent[]
            } catch (error) {
                console.error("Erro ao buscar odds:", error)
                return []
            }
        },
        [],
    )

    const fetchScores = useCallback(
        async (
            sportKey: string,
            options?: {
                dateFormat?: "iso" | "unix"
            },
        ) => {
            const cacheKey = `scores_${sportKey}_${JSON.stringify(options)}`

            // Verificar cache primeiro
            if (intelligentCache.shouldUseCache(cacheKey)) {
                const cached = intelligentCache.get(cacheKey)
                if (cached) return cached
            }

            const params = new URLSearchParams({
                type: "scores",
                sportKey,
                dateFormat: options?.dateFormat || "iso",
            })

            try {
                const res = await fetch(`/api/oddsApi?${params}`)

                if (!res.ok) {
                    return []
                }

                const data = await res.json()

                // Armazenar no cache
                intelligentCache.set(cacheKey, data)

                // Atualizar informações de quota
                intelligentCache.updateQuota(res.headers)

                return data
            } catch (error) {
                console.error("Erro ao buscar scores:", error)
                return []
            }
        },
        [],
    )

    const fetchEvents = useCallback(
        async (
            sportKey: string,
            options?: {
                dateFormat?: "iso" | "unix"
            },
        ) => {
            const cacheKey = `events_${sportKey}_${JSON.stringify(options)}`

            // Verificar cache primeiro
            if (intelligentCache.shouldUseCache(cacheKey)) {
                const cached = intelligentCache.get(cacheKey)
                if (cached) return cached
            }

            const params = new URLSearchParams({
                type: "events",
                sportKey,
                dateFormat: options?.dateFormat || "iso",
            })

            try {
                const res = await fetch(`/api/oddsApi?${params}`)

                if (!res.ok) {
                    return []
                }

                const data = await res.json()

                // Armazenar no cache
                intelligentCache.set(cacheKey, data)

                // Atualizar informações de quota
                intelligentCache.updateQuota(res.headers)

                return data
            } catch (error) {
                console.error("Erro ao buscar eventos:", error)
                return []
            }
        },
        [],
    )

    // Funções para dados históricos (mantidas como estavam)
    const fetchHistoricalOdds = useCallback(
        async (
            sportKey: string,
            date: string,
            options?: {
                regions?: string
                markets?: string
                oddsFormat?: "american" | "decimal" | "hongkong" | "indonesian" | "malay"
                dateFormat?: "iso" | "unix"
            },
        ) => {
            const cacheKey = `historical_odds_${sportKey}_${date}`

            if (intelligentCache.shouldUseCache(cacheKey)) {
                const cached = intelligentCache.get(cacheKey)
                if (cached) return cached
            }

            const params = new URLSearchParams({
                type: "historical_odds",
                sportKey,
                date,
                regions: options?.regions || "us,eu,uk",
                markets: options?.markets || "h2h",
                oddsFormat: options?.oddsFormat || "decimal",
                dateFormat: options?.dateFormat || "iso",
            })

            try {
                const res = await fetch(`/api/oddsApi?${params}`)

                if (!res.ok) {
                    return []
                }

                const data = await res.json()
                intelligentCache.set(cacheKey, data)
                intelligentCache.updateQuota(res.headers)
                return data
            } catch (error) {
                console.error("Erro ao buscar dados históricos:", error)
                return []
            }
        },
        [],
    )

    const fetchHistoricalEvents = useCallback(
        async (
            sportKey: string,
            date: string,
            options?: {
                dateFormat?: "iso" | "unix"
            },
        ) => {
            const cacheKey = `historical_events_${sportKey}_${date}`

            if (intelligentCache.shouldUseCache(cacheKey)) {
                const cached = intelligentCache.get(cacheKey)
                if (cached) return cached
            }

            const params = new URLSearchParams({
                type: "historical_events",
                sportKey,
                date,
                dateFormat: options?.dateFormat || "iso",
            })

            try {
                const res = await fetch(`/api/oddsApi?${params}`)

                if (!res.ok) {
                    return []
                }

                const data = await res.json()
                intelligentCache.set(cacheKey, data)
                intelligentCache.updateQuota(res.headers)
                return data
            } catch (error) {
                console.error("Erro ao buscar eventos históricos:", error)
                return []
            }
        },
        [],
    )

    const fetchHistoricalEventOdds = useCallback(
        async (
            eventId: string,
            options?: {
                regions?: string
                markets?: string
                oddsFormat?: "american" | "decimal" | "hongkong" | "indonesian" | "malay"
                dateFormat?: "iso" | "unix"
            },
        ) => {
            const cacheKey = `historical_event_odds_${eventId}`

            if (intelligentCache.shouldUseCache(cacheKey)) {
                const cached = intelligentCache.get(cacheKey)
                if (cached) return cached
            }

            const params = new URLSearchParams({
                type: "historical_event_odds",
                eventId,
                regions: options?.regions || "us,eu,uk",
                markets: options?.markets || "h2h",
                oddsFormat: options?.oddsFormat || "decimal",
                dateFormat: options?.dateFormat || "iso",
            })

            try {
                const res = await fetch(`/api/oddsApi?${params}`)

                if (!res.ok) {
                    return []
                }

                const data = await res.json()
                intelligentCache.set(cacheKey, data)
                intelligentCache.updateQuota(res.headers)
                return data
            } catch (error) {
                console.error("Erro ao buscar odds de evento histórico:", error)
                return []
            }
        },
        [],
    )

    return {
        sports,
        loading,
        fetchOdds,
        fetchScores,
        fetchEvents,
        fetchHistoricalOdds,
        fetchHistoricalEvents,
        fetchHistoricalEventOdds,
    }
}
