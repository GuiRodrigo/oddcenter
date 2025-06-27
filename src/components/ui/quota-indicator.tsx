"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { intelligentCache } from "@/lib/cache";
import { cn } from "@/lib/utils";

type QuotaInfo = {
  remaining: number;
  used: number;
  last: number;
};

type QuotaIndicatorProps = {
  showDetails?: boolean;
  className?: string;
};

export function QuotaIndicator({
  showDetails = false,
  className,
}: QuotaIndicatorProps) {
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo>({
    remaining: 1000,
    used: 0,
    last: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Atualizar quota info a cada 30 segundos
    const updateQuota = () => {
      const info = intelligentCache.getQuotaInfo();
      setQuotaInfo(info);
      setIsVisible(true);
    };

    updateQuota();
    const interval = setInterval(updateQuota, 30000);

    return () => clearInterval(interval);
  }, []);

  const getQuotaStatus = () => {
    const { remaining } = quotaInfo;

    if (remaining < 50)
      return { status: "critical", color: "text-red-500", icon: AlertTriangle };
    if (remaining < 200)
      return {
        status: "warning",
        color: "text-yellow-500",
        icon: AlertTriangle,
      };
    return { status: "good", color: "text-green-500", icon: CheckCircle };
  };

  const getQuotaPercentage = () => {
    const total = quotaInfo.remaining + quotaInfo.used;
    return total > 0 ? (quotaInfo.used / total) * 100 : 0;
  };

  const formatLastUpdate = () => {
    if (!quotaInfo.last) return "Nunca";

    const now = Date.now();
    const diff = now - quotaInfo.last;
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}m atrás`;

    const hours = Math.floor(minutes / 60);
    return `${hours}h atrás`;
  };

  const { status, color, icon: Icon } = getQuotaStatus();

  if (!isVisible) return null;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Info className="h-4 w-4" />
          Status da API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Status Geral */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Quota Restante</span>
          <div className="flex items-center gap-2">
            <Icon className={cn("h-4 w-4", color)} />
            <Badge
              variant={
                status === "critical"
                  ? "destructive"
                  : status === "warning"
                  ? "secondary"
                  : "default"
              }
              className="text-xs"
            >
              {quotaInfo.remaining}
            </Badge>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Uso</span>
            <span>{Math.round(getQuotaPercentage())}%</span>
          </div>
          <Progress
            value={getQuotaPercentage()}
            className={cn(
              "h-2",
              status === "critical" && "bg-red-100",
              status === "warning" && "bg-yellow-100"
            )}
          />
        </div>

        {/* Detalhes (opcional) */}
        {showDetails && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Usado:</span>
              <span>{quotaInfo.used}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Última atualização:</span>
              <span>{formatLastUpdate()}</span>
            </div>
          </div>
        )}

        {/* Avisos */}
        {status === "critical" && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            <AlertTriangle className="h-3 w-3 inline mr-1" />
            Quota muito baixa. Alguns dados podem não estar disponíveis.
          </div>
        )}

        {status === "warning" && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
            <AlertTriangle className="h-3 w-3 inline mr-1" />
            Quota moderada. Considere usar cache mais agressivo.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente compacto para header
export function QuotaIndicatorCompact() {
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo>({
    remaining: 1000,
    used: 0,
    last: 0,
  });

  useEffect(() => {
    const updateQuota = () => {
      const info = intelligentCache.getQuotaInfo();
      setQuotaInfo(info);
    };

    updateQuota();
    const interval = setInterval(updateQuota, 30000);

    return () => clearInterval(interval);
  }, []);

  const getQuotaStatus = () => {
    const { remaining } = quotaInfo;

    if (remaining < 50) return { status: "critical", color: "text-red-500" };
    if (remaining < 200) return { status: "warning", color: "text-yellow-500" };
    return { status: "good", color: "text-green-500" };
  };

  const { status, color } = getQuotaStatus();

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn("w-2 h-2 rounded-full", {
          "bg-red-500": status === "critical",
          "bg-yellow-500": status === "warning",
          "bg-green-500": status === "good",
        })}
      />
      <span className={cn("text-xs font-mono", color)}>
        {quotaInfo.remaining}
      </span>
    </div>
  );
}
