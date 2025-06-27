"use client";

import type React from "react";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type HeaderProps = {
  children?: React.ReactNode;
};

export function Header({ children }: HeaderProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {children}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary rounded-lg p-1">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">OddCenter</span>
          </Link>
        </div>

        <nav className="flex items-center space-x-4">
          {session?.user ? (
            <>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="hidden md:inline-flex"
                    onClick={() => setOpen(true)}
                  >
                    Sair
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Deseja realmente sair?</DialogTitle>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setOpen(false)}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        setLoading(true);
                        await signOut({ callbackUrl: "/" });
                        // O redirecionamento ocorre automaticamente
                        setLoading(false);
                      }}
                      disabled={loading}
                    >
                      {loading && <Loader2 className="animate-spin mr-2" />}
                      Sair
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user.image || "/placeholder-avatar.jpg"}
                        alt={session.user.name || "User Avatar"}
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
