import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para traduzir outcomes da API
export function translateOutcome(outcomeName: string): string {
  const translations: Record<string, string> = {
    Under: "Abaixo",
    Over: "Acima",
    Draw: "Empate",
    Home: "Casa",
    Away: "Fora",
    Yes: "Sim",
    No: "Não",
    Win: "Vitória",
    Loss: "Derrota",
    Tie: "Empate",
    Push: "Empate",
    Live: "Ao Vivo",
    Suspended: "Suspenso",
    Cancelled: "Cancelado",
    Postponed: "Adiado",
    Rescheduled: "Remarcado",
  };

  return translations[outcomeName] || outcomeName;
}

// Função para traduzir nomes de bookmakers para português
export function translateBookmaker(bookmakerName: string): string {
  const translations: Record<string, string> = {
    fanduel: "FanDuel",
    draftkings: "DraftKings",
    betmgm: "BetMGM",
    caesars: "Caesars",
    pointsbetus: "PointsBet",
    unibet_us: "Unibet",
    betrivers: "BetRivers",
    twinspires: "TwinSpires",
    bovada: "Bovada",
    mybookieag: "MyBookie",
    betonlineag: "BetOnline",
    sportsbettingag: "SportsBetting",
    xbet: "XBet",
    gtbets: "GTBets",
    intertops: "Intertops",
    bookmaker: "Bookmaker",
    "5dimes": "5Dimes",
    heritage: "Heritage",
    pinnacle: "Pinnacle",
    bet365: "Bet365",
    williamhill: "William Hill",
    ladbrokes: "Ladbrokes",
    coral: "Coral",
    betfair: "Betfair",
    skybet: "Sky Bet",
    paddypower: "Paddy Power",
    boylesports: "BoyleSports",
    unibet: "Unibet",
    mrgreen: "Mr Green",
    leo_vegas: "LeoVegas",
    casumo: "Casumo",
    comeon: "ComeOn",
    nordicbet: "NordicBet",
    betsafe: "Betsafe",
    netteller: "Neteller",
    skrill: "Skrill",
    paypal: "PayPal",
    visa: "Visa",
    mastercard: "Mastercard",
  };

  // Se não encontrar tradução específica, retorna o nome original
  return translations[bookmakerName.toLowerCase()] || bookmakerName;
}
