"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterOptions = {
  regions?: string[];
  markets?: string[];
  oddsFormat?: "american" | "decimal" | "hongkong" | "indonesian" | "malay";
  dateFormat?: "iso" | "unix";
  showCompleted?: boolean;
  showUpcoming?: boolean;
};

export type FilterPanelProps = {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearAll: () => void;
  className?: string;
};

const REGION_OPTIONS = [
  { value: "us", label: "Estados Unidos" },
  { value: "eu", label: "Europa" },
  { value: "uk", label: "Reino Unido" },
  { value: "au", label: "Austrália" },
];

const MARKET_OPTIONS = [
  { value: "h2h", label: "Resultado Final" },
  { value: "spreads", label: "Handicap" },
  { value: "totals", label: "Total de Pontos" },
  { value: "outrights", label: "Vencedor" },
];

const ODDS_FORMAT_OPTIONS = [
  { value: "decimal", label: "Decimal (1.50)" },
  { value: "american", label: "Americano (-200)" },
  { value: "hongkong", label: "Hong Kong (0.50)" },
  { value: "indonesian", label: "Indonésio (-2.00)" },
  { value: "malay", label: "Malaio (0.50)" },
];

export function FilterPanel({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  onClearAll,
  className,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const hasActiveFilters =
    filters.regions?.length ||
    filters.markets?.length ||
    filters.oddsFormat !== "decimal" ||
    filters.dateFormat !== "iso" ||
    filters.showCompleted === false ||
    filters.showUpcoming === false;

  const handleSearch = () => {
    onSearchChange(localSearchTerm);
  };

  const updateFilter = (
    key: keyof FilterOptions,
    value: string | string[] | boolean,
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleRegion = (region: string) => {
    const currentRegions = filters.regions || [];
    const newRegions = currentRegions.includes(region)
      ? currentRegions.filter((r) => r !== region)
      : [...currentRegions, region];
    updateFilter("regions", newRegions);
  };

  const toggleMarket = (market: string) => {
    const currentMarkets = filters.markets || [];
    const newMarkets = currentMarkets.includes(market)
      ? currentMarkets.filter((m) => m !== market)
      : [...currentMarkets, market];
    updateFilter("markets", newMarkets);
  };

  const handleClearAll = () => {
    setLocalSearchTerm("");
    onClearAll();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Barra de Busca */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar times, ligas, locais..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} variant="default">
          Buscar
        </Button>
        {(localSearchTerm || hasActiveFilters) && (
          <Button onClick={handleClearAll} variant="outline">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filtros Avançados */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros Avançados
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {Object.values(filters).filter(Boolean).length}
                </Badge>
              )}
            </div>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-4 pt-4">
          {/* Regiões */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Regiões</label>
            <div className="flex flex-wrap gap-2">
              {REGION_OPTIONS.map((region) => (
                <Button
                  key={region.value}
                  variant={
                    filters.regions?.includes(region.value)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => toggleRegion(region.value)}
                >
                  {region.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Mercados */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Mercados</label>
            <div className="flex flex-wrap gap-2">
              {MARKET_OPTIONS.map((market) => (
                <Button
                  key={market.value}
                  variant={
                    filters.markets?.includes(market.value)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => toggleMarket(market.value)}
                >
                  {market.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Formato das Odds */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Formato das Odds</label>
            <Select
              value={filters.oddsFormat || "decimal"}
              onValueChange={(value) => updateFilter("oddsFormat", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ODDS_FORMAT_OPTIONS.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Formato da Data */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Formato da Data</label>
            <Select
              value={filters.dateFormat || "iso"}
              onValueChange={(value) => updateFilter("dateFormat", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iso">ISO (2024-01-15T10:30:00Z)</SelectItem>
                <SelectItem value="unix">Unix (1705312200)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Opções de Exibição */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Exibição</label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showCompleted"
                  checked={filters.showCompleted !== false}
                  onChange={(e) =>
                    updateFilter("showCompleted", e.target.checked)
                  }
                  className="rounded"
                />
                <label htmlFor="showCompleted" className="text-sm">
                  Mostrar finalizados
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showUpcoming"
                  checked={filters.showUpcoming !== false}
                  onChange={(e) =>
                    updateFilter("showUpcoming", e.target.checked)
                  }
                  className="rounded"
                />
                <label htmlFor="showUpcoming" className="text-sm">
                  Mostrar futuros
                </label>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Filtros Ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.regions?.map((region) => (
            <Badge key={region} variant="secondary" className="text-xs">
              {REGION_OPTIONS.find((r) => r.value === region)?.label || region}
              <button
                onClick={() => toggleRegion(region)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.markets?.map((market) => (
            <Badge key={market} variant="secondary" className="text-xs">
              {MARKET_OPTIONS.find((m) => m.value === market)?.label || market}
              <button
                onClick={() => toggleMarket(market)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.oddsFormat && filters.oddsFormat !== "decimal" && (
            <Badge variant="secondary" className="text-xs">
              {
                ODDS_FORMAT_OPTIONS.find((f) => f.value === filters.oddsFormat)
                  ?.label
              }
              <button
                onClick={() => updateFilter("oddsFormat", "decimal")}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
