import { NextRequest, NextResponse } from "next/server";
import { intelligentCache } from "@/lib/cache";

const API_BASE = "https://api.the-odds-api.com/v4";
const API_KEY = process.env.ODDS_API_KEY;

if (!API_KEY) {
    throw new Error("ODDS_API_KEY não definida no .env.local");
}

// GET /api/oddsApi
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const sportKey = searchParams.get("sportKey");

    // Parâmetros melhorados para odds
    const regions = searchParams.get("regions") || "us,eu,uk"; // Múltiplas regiões
    const markets = searchParams.get("markets") || "h2h"; // Mercado padrão mais simples
    const oddsFormat = searchParams.get("oddsFormat") || "decimal"; // Formato das odds
    const dateFormat = searchParams.get("dateFormat") || "iso"; // Formato da data

    // Parâmetro para sports
    const all = searchParams.get("all") || "false"; // Incluir esportes inativos

    // Parâmetros para dados históricos
    const date = searchParams.get("date"); // Data para dados históricos
    const eventId = searchParams.get("eventId"); // ID do evento para dados históricos

    let url = "";
    let endpoint = "";

    // Função para determinar mercados apropriados por esporte
    const getAppropriateMarkets = (sportKey: string, requestedMarkets: string): string => {
        // Esportes que não suportam h2h (head-to-head)
        const noH2HSports = [
            'golf',
            'tennis',
            'mma',
            'boxing',
            'outrights'
        ];

        // Se o esporte não suporta h2h e foi solicitado, usar outrights
        if (noH2HSports.some(sport => sportKey.toLowerCase().includes(sport))) {
            if (requestedMarkets.includes('h2h')) {
                return 'outrights';
            }
        }

        return requestedMarkets;
    };

    if (type === "odds" && sportKey) {
        endpoint = "odds";
        const appropriateMarkets = getAppropriateMarkets(sportKey, markets);
        url = `${API_BASE}/sports/${sportKey}/odds?apiKey=${API_KEY}&regions=${regions}&markets=${appropriateMarkets}&oddsFormat=${oddsFormat}&dateFormat=${dateFormat}`;
    } else if (type === "scores" && sportKey) {
        endpoint = "scores";
        url = `${API_BASE}/sports/${sportKey}/scores?apiKey=${API_KEY}&dateFormat=${dateFormat}`;
    } else if (type === "events" && sportKey) {
        endpoint = "events";
        url = `${API_BASE}/sports/${sportKey}/events?apiKey=${API_KEY}&dateFormat=${dateFormat}`;
    } else if (type === "historical_odds" && sportKey && date) {
        endpoint = "historical_odds";
        const appropriateMarkets = getAppropriateMarkets(sportKey, markets);
        url = `${API_BASE}/historical/sports/${sportKey}/odds?apiKey=${API_KEY}&regions=${regions}&markets=${appropriateMarkets}&oddsFormat=${oddsFormat}&dateFormat=${dateFormat}&date=${date}`;
    } else if (type === "historical_events" && sportKey && date) {
        endpoint = "historical_events";
        url = `${API_BASE}/historical/sports/${sportKey}/events?apiKey=${API_KEY}&dateFormat=${dateFormat}&date=${date}`;
    } else if (type === "historical_event_odds" && eventId) {
        endpoint = "historical_event_odds";
        url = `${API_BASE}/historical/events/${eventId}/odds?apiKey=${API_KEY}&regions=${regions}&markets=${markets}&oddsFormat=${oddsFormat}&dateFormat=${dateFormat}`;
    } else {
        endpoint = "sports";
        url = `${API_BASE}/sports?apiKey=${API_KEY}&all=${all}`;
    }

    try {
        const res = await fetch(url, {
            next: { revalidate: 60 },
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!res.ok) {
            console.error(`[API] Erro na API externa (${endpoint}):`, res.status, res.statusText);

            return NextResponse.json({
                error: `Erro ao buscar dados da Odds API (${endpoint})`,
                status: res.status
            }, { status: 500 });
        }

        const data = await res.json();

        // Atualizar cache com informações de quota
        intelligentCache.updateQuota(res.headers);

        // Adicionar headers de quota da API externa
        const response = NextResponse.json(data);
        response.headers.set('x-requests-remaining', res.headers.get('x-requests-remaining') || '0');
        response.headers.set('x-requests-used', res.headers.get('x-requests-used') || '0');

        return response;
    } catch (error) {
        console.error(`[API] Erro ao fazer fetch (${endpoint}):`, error);
        return NextResponse.json({
            error: "Erro interno do servidor",
            endpoint
        }, { status: 500 });
    }
}
