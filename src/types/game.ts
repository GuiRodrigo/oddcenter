export type GameStatus = "live" | "upcoming" | "finished"

export type OddMarket = {
    id: string
    name: string
    odds: {
        option: string
        value: number
        change?: number // Variação da odd (positiva = subiu, negativa = desceu)
    }[]
}

export type TeamStats = {
    name: string
    logo?: string
    form: string[] // Últimos 5 jogos: "W" (vitória), "L" (derrota), "D" (empate)
    position?: number
    points?: number
    goalsFor?: number
    goalsAgainst?: number
}

export type GameDetail = {
    id: number
    category: string
    homeTeam: TeamStats
    awayTeam: TeamStats
    time: string
    date: string
    status: GameStatus
    league: string
    venue?: string
    referee?: string
    temperature?: string
    weather?: string
    markets: OddMarket[]
    headToHead?: {
        homeWins: number
        awayWins: number
        draws: number
        lastMeetings: {
            date: string
            result: string
            score: string
        }[]
    }
    liveStats?: {
        possession: { home: number; away: number }
        shots: { home: number; away: number }
        corners: { home: number; away: number }
        yellowCards: { home: number; away: number }
        redCards: { home: number; away: number }
    }
}
