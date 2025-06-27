# Componentes de Scores e Eventos

## Visão Geral

Novos componentes foram criados para exibir scores (resultados) e eventos da The Odds API, expandindo a funcionalidade da aplicação além das odds.

## Componentes Disponíveis

### 1. ScoresList

Componente para exibir scores e resultados de jogos.

#### Props

```typescript
type ScoresListProps = {
  sportKey: string; // Chave do esporte
  searchTerm?: string; // Termo de busca opcional
  showCompleted?: boolean; // Mostrar jogos finalizados (padrão: true)
};
```

#### Uso

```typescript
import { ScoresList } from "@/components/games/ScoresList";

function ScoresPage() {
  return (
    <ScoresList
      sportKey="soccer_brazil_campeonato"
      searchTerm="Flamengo"
      showCompleted={true}
    />
  );
}
```

#### Funcionalidades

- ✅ **Scores em tempo real**: Mostra resultados atualizados
- ✅ **Filtros**: Por termo de busca e status de conclusão
- ✅ **Status visual**: Diferencia jogos finalizados de em andamento
- ✅ **Informações detalhadas**: Data, hora e última atualização
- ✅ **Responsivo**: Adapta-se a diferentes tamanhos de tela

### 2. EventsList

Componente para exibir eventos futuros e passados.

#### Props

```typescript
type EventsListProps = {
  sportKey: string; // Chave do esporte
  searchTerm?: string; // Termo de busca opcional
  showUpcoming?: boolean; // Mostrar eventos futuros (padrão: true)
};
```

#### Uso

```typescript
import { EventsList } from "@/components/games/EventsList";

function EventsPage() {
  return (
    <EventsList
      sportKey="soccer_brazil_campeonato"
      searchTerm="Estádio"
      showUpcoming={true}
    />
  );
}
```

#### Funcionalidades

- ✅ **Eventos futuros/passados**: Filtro por período
- ✅ **Tempo relativo**: "em 2 dias", "em 5h", "hoje"
- ✅ **Localização**: Mostra venue/local do evento
- ✅ **Participantes**: Lista de participantes (quando disponível)
- ✅ **Status visual**: Cores diferentes por proximidade temporal

## Integração com Hook

Ambos os componentes usam o hook `useOdds`:

```typescript
const { fetchScores, fetchEvents } = useOdds();

// ScoresList usa fetchScores
const scores = await fetchScores(sportKey);

// EventsList usa fetchEvents
const events = await fetchEvents(sportKey);
```

## Estrutura de Dados

### ScoreEvent

```typescript
type ScoreEvent = {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  scores?: number[]; // [gols_casa, gols_visitante]
  last_update?: string; // Última atualização
  completed?: boolean; // Se o jogo foi finalizado
};
```

### Event

```typescript
type Event = {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  venue?: string; // Local do evento
  participants?: string[]; // Lista de participantes
};
```

## Exemplo de Implementação Completa

```typescript
import { useState } from "react";
import { ScoresList } from "@/components/games/ScoresList";
import { EventsList } from "@/components/games/EventsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function SportsDataPage() {
  const [sportKey, setSportKey] = useState("soccer_brazil_campeonato");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Dados Esportivos</h1>
        <input
          type="text"
          placeholder="Buscar times, locais..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded"
        />
      </div>

      <Tabs defaultValue="odds" className="space-y-4">
        <TabsList>
          <TabsTrigger value="odds">Odds</TabsTrigger>
          <TabsTrigger value="scores">Scores</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value="odds">
          <OddsGamesList sportKey={sportKey} searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="scores">
          <ScoresList sportKey={sportKey} searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="events">
          <EventsList sportKey={sportKey} searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## Estilização

### Cores de Status

- **Verde**: Jogos finalizados
- **Azul**: Jogos em andamento/futuros
- **Laranja**: Jogos próximos (próximas 24h)
- **Vermelho**: Jogos passados

### Animações

- **Hover**: Elevação suave dos cards
- **Transições**: Mudanças suaves de estado
- **Loading**: Skeletons durante carregamento

## Performance

### Otimizações

- ✅ **Cache inteligente**: Usa o sistema de cache
- ✅ **Lazy loading**: Carrega dados sob demanda
- ✅ **Filtros eficientes**: Filtragem no cliente
- ✅ **Debounce**: Evita requests excessivos

### Monitoramento

```typescript
// Verificar performance
console.log("Scores carregados:", scores.length);
console.log("Tempo de carregamento:", loadTime);
```

## Casos de Uso

### 1. Página de Resultados

```typescript
// Mostrar apenas resultados finalizados
<ScoresList sportKey="soccer_brazil_campeonato" showCompleted={true} />
```

### 2. Página de Próximos Jogos

```typescript
// Mostrar apenas eventos futuros
<EventsList sportKey="soccer_brazil_campeonato" showUpcoming={true} />
```

### 3. Busca Específica

```typescript
// Buscar por time específico
<ScoresList sportKey="soccer_brazil_campeonato" searchTerm="Flamengo" />
```

## Próximos Passos

- [ ] Componente de estatísticas
- [ ] Gráficos de performance
- [ ] Notificações de resultados
- [ ] Exportação de dados
- [ ] Comparação de times
- [ ] Histórico de confrontos
