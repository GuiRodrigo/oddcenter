"use client";

import { signIn, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Loader2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="w-full max-w-sm">
        {/* Logo e Título */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ scale: 0.7, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.4,
            }}
          >
            <motion.div
              className="bg-primary rounded-xl p-3 shadow-lg"
              initial={{ boxShadow: "0 0 0px 0px #0000" }}
              animate={{ boxShadow: "0 4px 32px 0px #6366f1aa" }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <TrendingUp className="h-8 w-8 text-primary-foreground" />
            </motion.div>
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">OddCenter</h1>
          <p className="text-muted-foreground text-sm">
            Sua plataforma de odds esportivas
          </p>
        </motion.div>

        {/* Card de Login */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
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
                className="w-full h-12 text-base text-muted font-medium bg-secondary"
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
        </motion.div>
      </div>
    </motion.div>
  );
}
