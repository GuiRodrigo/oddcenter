# OddCenter

Plataforma moderna para visualização de odds esportivas em tempo real.

## Sobre o projeto

O **OddCenter** é uma plataforma web que permite ao usuário explorar, comparar e acompanhar odds de apostas esportivas de diversos esportes e campeonatos, com uma interface intuitiva, responsiva e visualmente moderna.

### Funcionalidades principais

- Visualização de odds e jogos em tempo real
- Busca e filtro por times/campeonatos
- Favoritos e organização de categorias (drag & drop)
- Página de detalhes de cada jogo
- Autenticação via GitHub (NextAuth)
- Interface escura com identidade visual roxa
- Skeleton loading animado
- SEO otimizado (Open Graph, Twitter Card, favicon)

## Tecnologias utilizadas

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS**
- **framer-motion** (animações)
- **NextAuth.js** (autenticação)
- **Lodash** (manipulação de listas)
- **Dnd-kit** (drag & drop)
- **Vercel** (deploy)

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Deploy

O deploy está disponível em: [https://oddcenter.vercel.app/](https://oddcenter.vercel.app/)

O deploy é feito na [Vercel](https://vercel.com/). Basta conectar o repositório e configurar as variáveis de ambiente necessárias (ex: chaves da Odds API, NextAuth, etc).

## Licença

MIT

---

Desenvolvido por Guilherme para o desafio da ANA Gaming.
