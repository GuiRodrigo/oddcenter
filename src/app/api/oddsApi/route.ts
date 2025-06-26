import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.the-odds-api.com/v4";
const API_KEY = process.env.ODDS_API_KEY;

if (!API_KEY) {
    throw new Error("ODDS_API_KEY não definida no .env.local");
}

// GET /api/oddsApi/sports
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const sportKey = searchParams.get("sportKey");
    const region = searchParams.get("region") || "us";
    const oddsFormat = searchParams.get("oddsFormat") || "decimal";

    let url = "";
    if (type === "odds" && sportKey) {
        url = `${API_BASE}/sports/${sportKey}/odds?apiKey=${API_KEY}&regions=${region}&oddsFormat=${oddsFormat}`;
    } else {
        url = `${API_BASE}/sports?apiKey=${API_KEY}`;
    }

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
        return NextResponse.json({ error: "Erro ao buscar dados da Odds API" }, { status: 500 });
    }
    const data = await res.json();
    return NextResponse.json(data);
}
