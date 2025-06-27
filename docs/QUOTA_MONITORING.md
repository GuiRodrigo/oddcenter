# Monitoramento de Quota

## Visão Geral

O sistema de monitoramento de quota permite acompanhar o uso da API The Odds API em tempo real, fornecendo informações sobre requests restantes, uso atual e alertas quando a quota está baixa.

## Componentes Disponíveis

### 1. QuotaIndicator

Componente completo para exibir informações detalhadas de quota.

#### Props

```typescript
type QuotaIndicatorProps = {
  showDetails?: boolean; // Mostrar detalhes adicionais (padrão: false)
  className?: string; // Classes CSS opcionais
};
```

#### Uso

```typescript
import { QuotaIndicator } from "@/components/ui/quota-indicator";

function Dashboard() {
  return (
    <div className="grid gap-4">
      <QuotaIndicator showDetails={true} />
      {/* Outros componentes */}
    </div>
  );
}
```

### 2. QuotaIndicatorCompact

Versão compacta para uso em headers ou espaços limitados.

#### Uso

```typescript
import { QuotaIndicatorCompact } from "@/components/ui/quota-indicator";

function Header() {
  return (
    <header className="flex items-center justify-between">
      <h1>OddCenter</h1>
      <QuotaIndicatorCompact />
    </header>
  );
}
```

## Estados de Quota

### 1. Bom (Verde)

- **Condição**: Quota > 200
- **Cor**: Verde
- **Ícone**: CheckCircle
- **Comportamento**: Normal

### 2. Aviso (Amarelo)

- **Condição**: Quota 50-200
- **Cor**: Amarelo
- **Ícone**: AlertTriangle
- **Comportamento**: Cache moderado

### 3. Crítico (Vermelho)

- **Condição**: Quota < 50
- **Cor**: Vermelho
- **Ícone**: AlertTriangle
- **Comportamento**: Cache agressivo

## Integração com Cache Inteligente

O monitoramento de quota está integrado com o sistema de cache inteligente:

```typescript
// Atualizar quota após cada request
intelligentCache.updateQuota(response.headers);

// Verificar status da quota
const quotaInfo = intelligentCache.getQuotaInfo();
const isLow = intelligentCache.isQuotaLow();
```

## Exemplo de Implementação

### Dashboard Completo

```typescript
import { useState, useEffect } from "react";
import { QuotaIndicator } from "@/components/ui/quota-indicator";
import { intelligentCache } from "@/lib/cache";

function Dashboard() {
  const [quotaInfo, setQuotaInfo] = useState(null);
  const [showQuotaDetails, setShowQuotaDetails] = useState(false);

  useEffect(() => {
    const updateQuota = () => {
      const info = intelligentCache.getQuotaInfo();
      setQuotaInfo(info);
    };

    updateQuota();
    const interval = setInterval(updateQuota, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setShowQuotaDetails(!showQuotaDetails)}
          className="text-sm text-muted-foreground"
        >
          {showQuotaDetails ? "Ocultar" : "Mostrar"} detalhes da quota
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <QuotaIndicator showDetails={showQuotaDetails} />

        {/* Outros componentes do dashboard */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Ações Rápidas</h2>
          {quotaInfo && intelligentCache.isQuotaLow() && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h3 className="font-medium text-yellow-800">Quota Baixa</h3>
              <p className="text-sm text-yellow-700">
                Considere usar cache mais agressivo ou aguardar o reset da
                quota.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Header com Indicador Compacto

```typescript
import { QuotaIndicatorCompact } from "@/components/ui/quota-indicator";

function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary rounded-lg p-1">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">OddCenter</span>
          </Link>
        </div>

        <nav className="flex items-center space-x-4">
          <QuotaIndicatorCompact />
          {/* Outros elementos do header */}
        </nav>
      </div>
    </header>
  );
}
```

## Configuração Avançada

### Atualização Personalizada

```typescript
// Atualizar quota manualmente
const updateQuotaFromResponse = (response: Response) => {
  intelligentCache.updateQuota(response.headers);

  // Log para debugging
  const quotaInfo = intelligentCache.getQuotaInfo();
  console.log("Quota atualizada:", quotaInfo);
};

// Usar em fetch customizado
const customFetch = async (url: string) => {
  const response = await fetch(url);
  updateQuotaFromResponse(response);
  return response;
};
```

### Alertas Personalizados

```typescript
// Sistema de alertas baseado na quota
const checkQuotaAndAlert = () => {
  const quotaInfo = intelligentCache.getQuotaInfo();

  if (quotaInfo.remaining < 50) {
    // Mostrar alerta crítico
    showCriticalAlert("Quota muito baixa!");
  } else if (quotaInfo.remaining < 200) {
    // Mostrar aviso
    showWarningAlert("Quota moderada");
  }
};

// Executar verificação periodicamente
setInterval(checkQuotaAndAlert, 60000); // 1 minuto
```

## Métricas e Analytics

### Coleta de Dados

```typescript
// Coletar métricas de uso
const quotaMetrics = {
  timestamp: Date.now(),
  remaining: quotaInfo.remaining,
  used: quotaInfo.used,
  percentage: (quotaInfo.used / (quotaInfo.remaining + quotaInfo.used)) * 100,
  status: getQuotaStatus().status,
};

// Enviar para analytics
analytics.track("quota_update", quotaMetrics);
```

### Relatórios

```typescript
// Gerar relatório de uso
const generateQuotaReport = () => {
  const quotaInfo = intelligentCache.getQuotaInfo();

  return {
    currentUsage: quotaInfo.used,
    remainingQuota: quotaInfo.remaining,
    usagePercentage:
      (quotaInfo.used / (quotaInfo.remaining + quotaInfo.used)) * 100,
    lastUpdate: new Date(quotaInfo.last).toISOString(),
    recommendations: getQuotaRecommendations(quotaInfo),
  };
};
```

## Benefícios

### Para Desenvolvedores

- ✅ **Monitoramento em tempo real**: Acompanhar uso da API
- ✅ **Prevenção de erros**: Evitar exceder limites
- ✅ **Otimização**: Ajustar cache baseado na quota
- ✅ **Debugging**: Identificar problemas de uso

### Para Usuários

- ✅ **Transparência**: Ver status da API
- ✅ **Confiabilidade**: Saber quando dados podem estar indisponíveis
- ✅ **Performance**: Cache otimizado baseado na quota

## Próximos Passos

- [ ] Alertas por email/notificação
- [ ] Histórico de uso da quota
- [ ] Previsão de uso futuro
- [ ] Configurações de alerta personalizadas
- [ ] Integração com sistemas de monitoramento
- [ ] Dashboard de analytics de quota
