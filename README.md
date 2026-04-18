# Registro de Ocorrências

Sistema full-stack para gestão de ocorrências e manutenção industrial.

## Links em produção

- Frontend (painel): https://registro-de-ocorrencias-front.vercel.app/painel
- Backend (API): https://registrodeocorrencias-production.up.railway.app/

## Arquitetura do projeto

O repositório está organizado em monorepo, com separação clara entre interface web e API.

```
Registro_de_Ocorrencias/
├── Front_End/   # Aplicação web (Next.js)
└── Back_End/    # API GraphQL (NestJS)
```

### Frontend

- Responsável por autenticação, navegação e telas operacionais.
- Consome a API GraphQL via endpoint configurado em variável de ambiente.
- Estrutura baseada em App Router do Next.js, com componentes reutilizáveis e contexto de autenticação.

### Backend

- API GraphQL construída com NestJS em arquitetura modular.
- Módulos principais: Auth, Incidente e Machine.
- Cada módulo segue separação por resolver, service, DTOs e entidades.
- Autenticação com JWT para proteger queries e mutations.
- Persistência com Prisma Client conectado ao MongoDB Atlas.

### Fluxo geral

1. O usuário acessa o painel no frontend.
2. O frontend autentica via mutation de login.
3. O backend retorna um JWT.
4. O frontend envia o token no header Authorization.
5. O backend valida o token e processa operações de incidentes e máquinas.

## Tecnologias utilizadas

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI
- React Hook Form + Zod

### Backend

- NestJS
- GraphQL + Apollo Server
- TypeScript
- Prisma ORM
- JWT (autenticação)

### Infraestrutura

- MongoDB Atlas (banco de dados)
- Railway (deploy do backend)
- Vercel (deploy do frontend)
