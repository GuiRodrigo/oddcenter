# Filtros Avançados

## Visão Geral

O sistema de filtros avançados permite aos usuários personalizar completamente a exibição de dados esportivos, incluindo regiões, mercados, formatos de odds e opções de exibição.

## Componente FilterPanel

### Props

```typescript
type FilterPanelProps = {
  searchTerm: string; // Termo de busca atual
  onSearchChange: (term: string) => void; // Callback para mudança de busca
  filters: FilterOptions; // Filtros ativos
  onFiltersChange: (filters: FilterOptions) => void; // Callback para mudança de filtros
  onClearAll: () => void; // Callback para limpar tudo
  className?: string; // Classes CSS opcionais
};
```

### FilterOptions

```typescript
type FilterOptions = {
  regions?: string[]; // Regiões dos bookmakers
  markets?: string[]; // Tipos de mercados
  oddsFormat?: "american" | "decimal" | "hongkong" | "indonesian" | "malay";
  dateFormat?: "iso" | "unix"; // Formato da data
  showCompleted?: boolean; // Mostrar jogos finalizados
  showUpcoming?: boolean; // Mostrar eventos futuros
};
```

## Uso Básico

```typescript
import { FilterPanel } from "@/components/ui/filter-panel";
import { useState } from "react";

function SportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    regions: ["us", "eu"],
    markets: ["h2h"],
    oddsFormat: "decimal",
    dateFormat: "iso",
    showCompleted: true,
    showUpcoming: true,
  });

  const handleClearAll = () => {
    setSearchTerm("");
    setFilters({
      regions: [],
      markets: [],
      oddsFormat: "decimal",
      dateFormat: "iso",
      showCompleted: true,
      showUpcoming: true,
    });
  };

  return (
    <FilterPanel
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filters={filters}
      onFiltersChange={setFilters}
      onClearAll={handleClearAll}
    />
  );
}
```

## Opções de Filtro

### 1. Regiões

**Disponíveis:**

- `us` - Estados Unidos
- `eu` - Europa
- `uk` - Reino Unido
- `au` - Austrália

**Uso:**

```typescript
// Selecionar múltiplas regiões
setFilters({
  ...filters,
  regions: ["us", "eu", "uk"],
});
```

### 2. Mercados

**Disponíveis:**

- `h2h` - Resultado Final
- `spreads` - Handicap
- `totals` - Total de Pontos
- `outrights` - Vencedor

**Uso:**

```typescript
// Selecionar mercados específicos
setFilters({
  ...filters,
  markets: ["h2h", "spreads"],
});
```

### 3. Formato das Odds

**Disponíveis:**

- `decimal` - Decimal (1.50)
- `american` - Americano (-200)
- `hongkong` - Hong Kong (0.50)
- `indonesian` - Indonésio (-2.00)
- `malay` - Malaio (0.50)

**Uso:**

```typescript
// Mudar formato das odds
setFilters({
  ...filters,
  oddsFormat: "american",
});
```

### 4. Formato da Data

**Disponíveis:**

- `iso` - ISO (2024-01-15T10:30:00Z)
- `unix` - Unix (1705312200)

**Uso:**

```typescript
// Mudar formato da data
setFilters({
  ...filters,
  dateFormat: "unix",
});
```

### 5. Opções de Exibição

**Disponíveis:**

- `showCompleted` - Mostrar jogos finalizados
- `showUpcoming` - Mostrar eventos futuros

**Uso:**

```typescript
// Mostrar apenas eventos futuros
setFilters({
  ...filters,
  showCompleted: false,
  showUpcoming: true,
});
```

## Integração com API

### Aplicar Filtros na API

```typescript
const { fetchOdds } = useOdds();

const loadFilteredData = async (sportKey: string, filters: FilterOptions) => {
  const data = await fetchOdds(sportKey, {
    regions: filters.regions?.join(","),
    markets: filters.markets?.join(","),
    oddsFormat: filters.oddsFormat,
    dateFormat: filters.dateFormat,
  });

  // Aplicar filtros de exibição no cliente
  let filteredData = data;

  if (filters.showCompleted === false) {
    filteredData = filteredData.filter((event) => !event.completed);
  }

  if (filters.showUpcoming === false) {
    filteredData = filteredData.filter((event) => {
      const eventDate = new Date(event.commence_time);
      return eventDate <= new Date();
    });
  }

  return filteredData;
};
```

## Interface do Usuário

### Estados Visuais

1. **Filtros Inativos**: Botões outline
2. **Filtros Ativos**: Botões preenchidos
3. **Contador**: Badge mostrando número de filtros ativos
4. **Filtros Ativos**: Chips removíveis

### Interações

- **Clique**: Alternar filtro
- **Enter**: Executar busca
- **X**: Remover filtro individual
- **Limpar Tudo**: Remover todos os filtros

## Exemplo Completo

```typescript
import { useState, useEffect } from "react";
import { FilterPanel, FilterOptions } from "@/components/ui/filter-panel";
import { OddsGamesList } from "@/components/games/OddsGamesList";
import { useOdds } from "@/components/odds/OddsContext";

function AdvancedSportsPage() {
  const { fetchOdds } = useOdds();
  const [sportKey, setSportKey] = useState("soccer_brazil_campeonato");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    regions: ["us", "eu"],
    markets: ["h2h", "spreads"],
    oddsFormat: "decimal",
    dateFormat: "iso",
    showCompleted: true,
    showUpcoming: true,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchOdds(sportKey, {
        regions: filters.regions?.join(","),
        markets: filters.markets?.join(","),
        oddsFormat: filters.oddsFormat,
        dateFormat: filters.dateFormat,
      });

      // Aplicar filtros de exibição
      let processedData = data;

      if (filters.showCompleted === false) {
        processedData = processedData.filter((event) => !event.completed);
      }

      if (filters.showUpcoming === false) {
        processedData = processedData.filter((event) => {
          const eventDate = new Date(event.commence_time);
          return eventDate <= new Date();
        });
      }

      setFilteredData(processedData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [sportKey, filters]);

  const handleClearAll = () => {
    setSearchTerm("");
    setFilters({
      regions: [],
      markets: [],
      oddsFormat: "decimal",
      dateFormat: "iso",
      showCompleted: true,
      showUpcoming: true,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dados Esportivos Avançados</h1>

      <FilterPanel
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        onClearAll={handleClearAll}
      />

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <OddsGamesList
          sportKey={sportKey}
          searchTerm={searchTerm}
          data={filteredData}
        />
      )}
    </div>
  );
}
```

## Benefícios

### Para Usuários

- ✅ **Personalização**: Controle total sobre dados exibidos
- ✅ **Eficiência**: Filtros rápidos e intuitivos
- ✅ **Flexibilidade**: Múltiplas opções de configuração
- ✅ **Transparência**: Visualização clara dos filtros ativos

### Para Desenvolvedores

- ✅ **Reutilizável**: Componente modular
- ✅ **Tipado**: TypeScript completo
- ✅ **Extensível**: Fácil adicionar novos filtros
- ✅ **Performance**: Filtros otimizados

## Próximos Passos

- [ ] Filtros por data/hora
- [ ] Filtros por bookmaker específico
- [ ] Filtros salvos/favoritos
- [ ] Exportação de configurações
- [ ] Filtros por estatísticas
- [ ] Filtros geográficos avançados
