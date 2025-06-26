"use client";

import { signIn, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, Loader2, TrendingUp } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const router = useRouter();

  // Verifica se o usuário já está logado
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

  // Mostra loading enquanto verifica a sessão
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e Título */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="bg-primary rounded-lg p-2">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">OddCenter</h1>
          </div>
          <p className="text-muted-foreground">
            Sua plataforma de visualização de apostas esportivas
          </p>
        </div>

        {/* Card de Login */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
            <CardDescription>
              Entre com sua conta do GitHub para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGitHubSignIn}
              disabled={isLoading}
              className="w-full h-11 text-base"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <Github className="mr-2 h-4 w-4" />
                  Entrar com GitHub
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Ao continuar, você concorda com nossos{" "}
              <a
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Política de Privacidade
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 text-center">
          <div className="space-y-2">
            <h3 className="font-semibold">🎯 Visualize Odds</h3>
            <p className="text-sm text-muted-foreground">
              Acompanhe as melhores odds em tempo real
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">📊 Organize Favoritos</h3>
            <p className="text-sm text-muted-foreground">
              Drag & drop para organizar suas categorias
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">🔒 Acesso Seguro</h3>
            <p className="text-sm text-muted-foreground">
              Autenticação segura via GitHub
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
