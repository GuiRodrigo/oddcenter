import { withAuth } from "next-auth/middleware"

export default withAuth(
    function middleware(req) {
        // Lógica adicional do middleware pode ser adicionada aqui
        console.log("Middleware executado para:", req.nextUrl.pathname)
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Retorna true se o usuário pode acessar a página
                const { pathname } = req.nextUrl

                // Permite acesso à página de login sempre
                if (pathname === "/login") {
                    return true
                }

                // Para outras páginas, verifica se tem token (está logado)
                return !!token
            },
        },
    },
)

// Configura quais rotas o middleware deve proteger
export const config = {
    matcher: [
        // Protege todas as rotas exceto as listadas abaixo
        "/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)",
    ],
}
