"use client";

import type React from "react";

import { useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useSport } from "@/components/providers/SportProvider";

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const { selectedSport, setSelectedSport } = useSport();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSportSelect = (sportKey: string) => {
    setSelectedSport(sportKey);
    setSidebarOpen(false); // Fechar sidebar no mobile após seleção
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <Sidebar
          selectedSport={selectedSport}
          onSportSelect={handleSportSelect}
          className="h-full"
        />
      </div>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-64 bg-background border-r">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Sidebar
              selectedSport={selectedSport}
              onSportSelect={handleSportSelect}
              className="h-full border-r-0"
            />
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </Header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
