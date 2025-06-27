"use client";

import { signIn, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Loader2, TrendingUp } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/");
      }
      setIsCheckingSession(false);
    };
    checkSession();
  }, [router]);

  const handleGitHubSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("github", {
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipSignIn = async () => {
    try {
      setIsLoading(true);
      router.push("/");
    } catch (error) {
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mostra loading enquanto verifica a sessão
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Verificando acesso...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="w-full max-w-sm">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-xl p-3 shadow-lg">
              <TrendingUp className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">OddCenter</h1>
          <p className="text-muted-foreground text-sm">
            Sua plataforma de odds esportivas
          </p>
        </div>

        {/* Card de Login */}
        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Entrar na plataforma</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleGitHubSignIn}
              disabled={isLoading}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <Github className="mr-2 h-5 w-5" />
                  Continuar com GitHub
                </>
              )}
            </Button>
            <Button
              onClick={handleSkipSignIn}
              disabled={isLoading}
              className="w-full h-12 text-base text-muted-foreground font-medium bg-secondary"
              size="lg"
            >
              Continuar como visitante
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Acesso seguro e rápido com sua conta GitHub
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
