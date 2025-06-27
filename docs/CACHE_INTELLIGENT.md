# Cache Inteligente Baseado em Quota

## Visão Geral

O sistema de cache inteligente monitora a quota da API The Odds API e ajusta automaticamente a estratégia de cache baseado na disponibilidade de requests restantes.

## Como Funciona

### Estratégia de Cache Dinâmica

O sistema ajusta o TTL (Time To Live) baseado na quota restante:

- **Quota > 200**: Cache de 2 minutos (normal)
- **Quota 50-200**: Cache de 5 minutos (moderado)
- **Quota < 50**: Cache de 10 minutos (agressivo)

### Monitoramento de Quota

```typescript
// Atualizar informações de quota após cada request
intelligentCache.updateQuota(response.headers);

// Verificar se a quota está baixa
if (intelligentCache.isQuotaLow()) {
  // Usar cache mais agressivo
}
```

## Uso

### Básico

```typescript
import { intelligentCache } from "@/lib/cache";

// Verificar se deve usar cache
const cacheKey = `odds_${sportKey}_${regions}`;
if (intelligentCache.shouldUseCache(cacheKey)) {
  const cachedData = intelligentCache.get(cacheKey);
  if (cachedData) return cachedData;
}

// Fazer request e armazenar no cache
const data = await fetchOdds(sportKey);
intelligentCache.set(cacheKey, data);
```

### Com Hook

```typescript
const { fetchOdds } = useOdds();

const loadOdds = async (sportKey: string) => {
  const cacheKey = `odds_${sportKey}`;

  // Tentar cache primeiro
  const cached = intelligentCache.get(cacheKey);
  if (cached) return cached;

  // Fazer request se não há cache
  const data = await fetchOdds(sportKey);
  intelligentCache.set(cacheKey, data);
  return data;
};
```

## Benefícios

- ✅ **Economia de Quota**: Reduz requests desnecessários
- ✅ **Performance**: Respostas mais rápidas
- ✅ **Adaptativo**: Ajusta automaticamente baseado na quota
- ✅ **Transparente**: Funciona sem mudanças na API

## Configuração

### TTLs Configuráveis

```typescript
// Personalizar TTLs baseado na quota
private getTTL(): number {
  const { remaining } = this.quotaInfo;

  if (remaining < 50) return 10 * 60 * 1000; // 10 min
  if (remaining < 200) return 5 * 60 * 1000;  // 5 min
  return 2 * 60 * 1000; // 2 min
}
```

### Limpeza Automática

O cache é limpo automaticamente a cada 5 minutos para remover entradas expiradas.

## Monitoramento

### Informações de Quota

```typescript
const quotaInfo = intelligentCache.getQuotaInfo();
console.log(`Quota restante: ${quotaInfo.remaining}`);
console.log(`Quota usada: ${quotaInfo.used}`);
```

### Status do Cache

```typescript
// Verificar se a quota está baixa
if (intelligentCache.isQuotaLow()) {
  console.warn("Quota baixa - usando cache agressivo");
}
```

## Integração com API Route

```typescript
// Em /api/oddsApi/route.ts
import { intelligentCache } from "@/lib/cache";

export async function GET(req: NextRequest) {
  // ... lógica da API

  // Atualizar quota após response
  intelligentCache.updateQuota(res.headers);

  return response;
}
```

## Considerações

- **Dados Desatualizados**: Cache pode retornar dados antigos
- **Memória**: Cache cresce com o tempo (limpeza automática)
- **Quota Baixa**: Pode usar dados muito antigos se quota estiver baixa

## Próximos Passos

- [ ] Implementar cache persistente (localStorage)
- [ ] Adicionar métricas de cache hit/miss
- [ ] Cache por usuário/sessão
- [ ] Cache inteligente por tipo de dados
