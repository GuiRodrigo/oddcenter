"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bem-vindo ao OddCenter</h1>
          <p className="mb-4">
            Você precisa estar logado para acessar esta página.
          </p>
          <button
            onClick={() => signIn("github")}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Entrar com GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Bem-vindo, {session.user?.name}!
            </h1>
            <p className="text-gray-600">Esta é uma página protegida.</p>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sair
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Informações da Sessão:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
