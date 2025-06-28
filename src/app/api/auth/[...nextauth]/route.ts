import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Importante: Usar a nova sintaxe do App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
