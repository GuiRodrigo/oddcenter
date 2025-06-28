interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live em milissegundos
}

interface QuotaInfo {
  remaining: number;
  used: number;
  last: number;
}

class IntelligentCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private quotaInfo: QuotaInfo = { remaining: 1000, used: 0, last: 0 };

  // Atualizar informações de quota
  updateQuota(headers: Headers) {
    const remaining = parseInt(headers.get("x-requests-remaining") || "1000");
    const used = parseInt(headers.get("x-requests-used") || "0");

    this.quotaInfo = { remaining, used, last: Date.now() };
  }

  // Determinar TTL baseado na quota restante
  private getTTL(): number {
    const { remaining } = this.quotaInfo;

    if (remaining < 50) {
      return 10 * 60 * 1000; // 10 minutos - cache agressivo
    } else if (remaining < 200) {
      return 5 * 60 * 1000; // 5 minutos - cache moderado
    } else {
      return 2 * 60 * 1000; // 2 minutos - cache normal
    }
  }

  // Verificar se deve usar cache
  shouldUseCache(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;

    // Se a quota está baixa, usar cache mesmo expirado
    if (this.quotaInfo.remaining < 100 && !isExpired) {
      return true;
    }

    return !isExpired;
  }

  // Obter dados do cache
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  // Armazenar dados no cache
  set<T>(key: string, data: T): void {
    const ttl = this.getTTL();
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // Limpar cache expirado
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Obter informações de quota
  getQuotaInfo(): QuotaInfo {
    return { ...this.quotaInfo };
  }

  // Verificar se a quota está baixa
  isQuotaLow(): boolean {
    return this.quotaInfo.remaining < 100;
  }
}

export const intelligentCache = new IntelligentCache();

// Limpar cache expirado a cada 5 minutos
if (typeof window !== "undefined") {
  setInterval(
    () => {
      intelligentCache.cleanup();
    },
    5 * 60 * 1000,
  );
}
