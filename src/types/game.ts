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

// Tipos para dados de odds da Odds API
export type OddsOutcome = {
    name: string // Nome do time ou resultado (ex: "Botafogo", "Draw")
    price: number // Odd para esse resultado
}

export type OddsMarket = {
    key: string // Tipo do mercado (ex: "h2h")
    last_update: string // Data/hora da última atualização
    outcomes: OddsOutcome[] // Lista de opções de aposta
}

export type OddsBookmaker = {
    key: string // Identificador do bookmaker (ex: "fanduel")
    title: string // Nome do bookmaker (ex: "FanDuel")
    last_update: string // Data/hora da última atualização
    markets: OddsMarket[] // Mercados disponíveis nesse bookmaker
}

export type OddsEvent = {
    id: string // ID do evento
    sport_key: string // Chave do esporte (ex: "soccer_brazil_campeonato")
    sport_title: string // Nome do campeonato
    commence_time: string // Data/hora do início do evento
    home_team: string // Nome do time da casa
    away_team: string // Nome do time visitante
    bookmakers: OddsBookmaker[] // Bookmakers e odds disponíveis
}

export type OddsSport = {
    key: string // Identificador do esporte (ex: "americanfootball_cfl")
    group: string // Grupo do esporte (ex: "American Football")
    title: string // Nome do esporte/campeonato (ex: "CFL")
    description: string // Descrição (ex: "Canadian Football League")
    active: boolean // Se está ativo no momento
    has_outrights: boolean // Se possui mercados outrights (ex: campeão da temporada)
}

// Tipos para EventsList
export type Event = {
    id: string
    sport_key: string
    sport_title: string
    commence_time: string
    home_team: string
    away_team: string
    venue?: string
    participants?: string[]
}

// Tipos para ScoresList
export type ScoreEvent = {
    id: string
    sport_key: string
    sport_title: string
    commence_time: string
    home_team: string
    away_team: string
    scores?: number[]
    last_update?: string
    completed?: boolean
}
