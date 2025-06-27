# Dados Históricos

## Visão Geral

O sistema agora suporta dados históricos da The Odds API, permitindo acessar odds e eventos de datas passadas para análise de tendências e comparações.

## Endpoints Disponíveis

### 1. Odds Históricas por Esporte

```typescript
// Buscar odds históricas de um esporte em uma data específica
/api/oddsApi?type=historical_odds&sportKey=soccer_brazil_campeonato&date=2024-01-15
```

**Parâmetros:**

- `type`: `historical_odds`
- `sportKey`: Chave do esporte
- `date`: Data no formato YYYY-MM-DD
- `regions`: Regiões dos bookmakers (opcional)
- `markets`: Tipos de mercados (opcional)
- `oddsFormat`: Formato das odds (opcional)
- `dateFormat`: Formato da data (opcional)

### 2. Eventos Históricos por Esporte

```typescript
// Buscar eventos históricos de um esporte em uma data específica
/api/oddsApi?type=historical_events&sportKey=soccer_brazil_campeonato&date=2024-01-15
```

**Parâmetros:**

- `type`: `historical_events`
- `sportKey`: Chave do esporte
- `date`: Data no formato YYYY-MM-DD
- `dateFormat`: Formato da data (opcional)

### 3. Odds Históricas de um Evento Específico

```typescript
// Buscar odds históricas de um evento específico
/api/oddsApi?type=historical_event_odds&eventId=abc123
```

**Parâmetros:**

- `type`: `historical_event_odds`
- `eventId`: ID do evento
- `regions`: Regiões dos bookmakers (opcional)
- `markets`: Tipos de mercados (opcional)
- `oddsFormat`: Formato das odds (opcional)
- `dateFormat`: Formato da data (opcional)

## Uso com Hook

### Hook useOdds

```typescript
import { useOdds } from "@/components/odds/OddsContext";

const { fetchHistoricalOdds, fetchHistoricalEvents, fetchHistoricalEventOdds } =
  useOdds();

// Buscar odds históricas
const historicalOdds = await fetchHistoricalOdds(
  "soccer_brazil_campeonato",
  "2024-01-15",
  {
    regions: "us,eu,uk",
    markets: "h2h,spreads,totals",
    oddsFormat: "decimal",
  }
);

// Buscar eventos históricos
const historicalEvents = await fetchHistoricalEvents(
  "soccer_brazil_campeonato",
  "2024-01-15"
);

// Buscar odds de um evento específico
const eventOdds = await fetchHistoricalEventOdds("abc123", {
  regions: "us,eu,uk",
  markets: "h2h",
});
```

## Cache Inteligente

Todos os dados históricos são automaticamente cacheados usando o sistema de cache inteligente:

- **Cache Key**: `historical_odds_${sportKey}_${date}`
- **TTL**: Baseado na quota restante (2-10 minutos)
- **Benefício**: Reduz requests desnecessários para dados que não mudam

## Casos de Uso

### 1. Análise de Tendências

```typescript
// Comparar odds ao longo do tempo
const todayOdds = await fetchOdds("soccer_brazil_campeonato");
const yesterdayOdds = await fetchHistoricalOdds(
  "soccer_brazil_campeonato",
  "2024-01-14"
);

// Analisar mudanças nas odds
const oddsChanges = analyzeOddsChanges(todayOdds, yesterdayOdds);
```

### 2. Relatórios Históricos

```typescript
// Gerar relatório de odds de uma semana
const weekDates = getWeekDates();
const weeklyOdds = await Promise.all(
  weekDates.map((date) => fetchHistoricalOdds("soccer_brazil_campeonato", date))
);

const report = generateWeeklyReport(weeklyOdds);
```

### 3. Validação de Previsões

```typescript
// Comparar previsões com resultados reais
const predictedOdds = await fetchHistoricalEventOdds("event_id_before_game");
const actualResults = await fetchHistoricalEventOdds("event_id_after_game");

const accuracy = validatePredictions(predictedOdds, actualResults);
```

## Limitações

### Quota

- Dados históricos consomem mais quota que dados atuais
- Recomendado usar cache agressivo
- Monitorar uso da quota

### Disponibilidade

- Dados históricos podem não estar disponíveis para todas as datas
- Alguns eventos podem ter dados limitados
- Período de retenção varia por esporte

### Performance

- Requests históricos podem ser mais lentos
- Cache é essencial para boa performance
- Considerar paginação para grandes volumes

## Exemplo Completo

```typescript
import { useOdds } from "@/components/odds/OddsContext";
import { useState, useEffect } from "react";

function HistoricalAnalysis() {
  const { fetchHistoricalOdds } = useOdds();
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadHistoricalData = async (sportKey: string, date: string) => {
    setLoading(true);
    try {
      const data = await fetchHistoricalOdds(sportKey, date, {
        regions: "us,eu,uk",
        markets: "h2h,spreads,totals",
        oddsFormat: "decimal",
      });
      setHistoricalData(data);
    } catch (error) {
      console.error("Erro ao carregar dados históricos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Análise Histórica</h2>
      <button
        onClick={() =>
          loadHistoricalData("soccer_brazil_campeonato", "2024-01-15")
        }
      >
        Carregar Dados de 15/01/2024
      </button>

      {loading && <p>Carregando...</p>}

      {historicalData.map((event) => (
        <div key={event.id}>
          <h3>
            {event.home_team} vs {event.away_team}
          </h3>
          <p>Data: {event.commence_time}</p>
          {/* Renderizar odds históricas */}
        </div>
      ))}
    </div>
  );
}
```

## Próximos Passos

- [ ] Componente de visualização de tendências
- [ ] Gráficos de evolução de odds
- [ ] Relatórios automáticos
- [ ] Alertas de mudanças significativas
- [ ] Exportação de dados históricos
