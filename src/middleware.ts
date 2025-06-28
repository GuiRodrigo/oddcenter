import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Lógica adicional do middleware pode ser adicionada aqui
    console.log("[Middleware] Executado para:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Retorna true se o usuário pode acessar a página
        const { pathname } = req.nextUrl;

        // Retorna true se o usuário tentar ver as odds sem logas
        if (pathname === "/api/oddsApi") {
          return true;
        }
        // Permite acesso à página de login sempre
        if (pathname === "/login") {
          return true;
        }

        if (pathname === "/") {
          return true;
        }

        // Para outras páginas, verifica se tem token (está logado)
        const isAuthorized = !!token;
        return isAuthorized;
      },
    },
  },
);

// Configura quais rotas o middleware deve proteger
export const config = {
  matcher: [
    // Protege todas as rotas exceto as listadas abaixo
    "/((?!api/auth|api/oddsApi|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
