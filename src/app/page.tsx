"use client";

import { useSession } from "next-auth/react";
import { useState, useCallback } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { OddsGamesList } from "@/components/games/OddsGamesList";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function HomePageSkeleton() {
  const [selectedSport, setSelectedSport] = useState<string>(
    "soccer_brazil_campeonato"
  );
  return (
    <MainLayout
      selectedSport={selectedSport}
      setSelectedSport={setSelectedSport}
    >
      <div className="container py-8 px-4 md:px-6">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-5 w-80 mx-auto" />
          </div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Componente SearchBar isolado
function SearchBar({
  onSearch,
  onClear,
}: {
  onSearch: (term: string) => void;
  onClear: () => void;
}) {
  const [value, setValue] = useState("");
  const handleSearch = useCallback(() => {
    onSearch(value);
  }, [onSearch, value]);
  const handleClear = useCallback(() => {
    setValue("");
    onClear();
  }, [onClear]);
  return (
    <div className="flex justify-center mb-4 gap-2">
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar por time..."
        className="max-w-md"
      />
      <Button onClick={handleSearch} variant="default">
        Buscar
      </Button>
      <Button onClick={handleClear} variant="outline">
        Limpar
      </Button>
    </div>
  );
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const [selectedSport, setSelectedSport] = useState<string>(
    "soccer_brazil_campeonato"
  );
  const [appliedSearch, setAppliedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  if (status === "loading") {
    return <HomePageSkeleton />;
  }

  return (
    <MainLayout
      selectedSport={selectedSport}
      setSelectedSport={setSelectedSport}
    >
      <div className="container py-8 px-4 md:px-6">
        <div className="space-y-6">
          {/* Boas-vindas */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">
              Bem-vindo{session ? `, ${session.user?.name}` : ""}!
            </h1>
            <p className="text-muted-foreground">
              Explore as melhores odds de apostas esportivas em tempo real.
            </p>
          </div>

          {/* Campo de busca isolado */}
          <SearchBar
            onSearch={setAppliedSearch}
            onClear={() => setAppliedSearch("")}
          />

          {/* Filtros de ordenação */}
          <div className="flex justify-center gap-2 mb-4">
            <Select
              value={sortOrder}
              onValueChange={(v) => setSortOrder(v as "asc" | "desc")}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ordem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Mais próximos</SelectItem>
                <SelectItem value="desc">Mais distantes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de jogos */}
          {selectedSport ? (
            <OddsGamesList
              sportKey={selectedSport}
              searchTerm={appliedSearch}
              sortOrder={sortOrder}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Selecione um esporte no menu lateral para ver os jogos
                  disponíveis.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
