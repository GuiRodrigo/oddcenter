"use client"

import { useState, useEffect } from "react"
import type { OddsEvent } from "@/types/game"

export function useGameDetails(gameId: string) {
    const [game, setGame] = useState<OddsEvent | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!gameId) return

        const fetchGameDetails = async () => {
            setLoading(true)
            setError(null)

            try {
                // Como a API não tem endpoint específico por jogo, vamos simular
                // buscando todos os jogos do esporte e filtrando pelo ID
                // Em uma implementação real, você teria um endpoint específico

                // Por enquanto, vamos usar dados do localStorage se disponível
                const cachedGames = localStorage.getItem("cachedGames")
                if (cachedGames) {
                    const games: OddsEvent[] = JSON.parse(cachedGames)
                    const foundGame = games.find((g) => g.id === gameId)
                    if (foundGame) {
                        setGame(foundGame)
                    } else {
                        setError("Jogo não encontrado")
                    }
                } else {
                    setError("Dados não disponíveis")
                }
            } catch (err) {
                setError("Erro ao carregar detalhes do jogo")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchGameDetails()
    }, [gameId])

    return { game, loading, error }
}
