"use client";

import { useSession } from "next-auth/react";
import { useState, useCallback } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { OddsGamesList } from "@/components/games/OddsGamesList";
import { ScoresList } from "@/components/games/ScoresList";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSport } from "@/components/providers/SportProvider";
import { motion } from "framer-motion";

function HomePageSkeleton() {
  return (
    <MainLayout>
      <motion.div
        className="container py-8 px-4 md:px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
      </motion.div>
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
  const { selectedSport } = useSport();
  const [appliedSearch, setAppliedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState<"odds" | "scores">("odds");

  if (status === "loading") {
    return <HomePageSkeleton />;
  }

  return (
    <MainLayout>
      <motion.div
        className="container py-8 px-4 md:px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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

          {/* Tabs para Odds e Scores */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "odds" | "scores")}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="odds">Odds e Apostas</TabsTrigger>
              <TabsTrigger value="scores">Scores e Resultados</TabsTrigger>
            </TabsList>

            {/* Tab de Odds */}
            <TabsContent value="odds" className="space-y-4">
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
            </TabsContent>

            {/* Tab de Scores */}
            <TabsContent value="scores" className="space-y-4">
              {selectedSport ? (
                <ScoresList
                  sportKey={selectedSport}
                  searchTerm={appliedSearch}
                  showCompleted={true}
                />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Selecione um esporte no menu lateral para ver os scores e
                      resultados disponíveis.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </MainLayout>
  );
}
