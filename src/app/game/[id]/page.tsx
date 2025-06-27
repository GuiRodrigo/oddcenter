"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGameDetails } from "@/hooks/useGameDetails";
import { MainLayout } from "@/components/layout/main-layout";
import { GameDetailsView } from "@/components/games/GameDetailsView";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

function GameDetailSkeleton() {
  return (
    <MainLayout>
      <div className="container py-8 px-4 md:px-6">
        <div className="space-y-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-48 w-full" />
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

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const { game, loading, error } = useGameDetails(params.id as string);

  const handleBack = () => {
    router.push("/");
  };

  if (status === "loading" || loading) {
    return <GameDetailSkeleton />;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  if (error || !game) {
    return (
      <MainLayout>
        <div className="container py-8 px-4 md:px-6">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h1 className="text-2xl font-bold mb-2">Jogo não encontrado</h1>
                <p className="text-muted-foreground mb-4">
                  {error ||
                    "O jogo que você está procurando não existe ou não está mais disponível."}
                </p>
                <Button onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8 px-4 md:px-6">
        <GameDetailsView game={game} onBack={handleBack} />
      </div>
    </MainLayout>
  );
}
