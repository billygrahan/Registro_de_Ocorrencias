# Registro de Ocorrências de Manutenção (ACERT)

Projeto full-stack para desenvolvimento de sistema de registro de ocorrências de manutenção usando tecnologias modernas.

## 📋 Estrutura do Projeto

```
Registro_de_Ocorrencias/
├── Back_End/          # API GraphQL com Next.js
├── Front_End/         # Interface web (React/Next.js)
├── README.md          # Este arquivo
└── .gitignore        # Configuração de git
```

## 🚀 Stack Tecnológico - Backend

- **Node.js + TypeScript** - Runtime e linguagem
- **Next.js 14** - Framework web
- **GraphQL** - Linguagem de query para API
- **Apollo Server** - Servidor GraphQL
- **Prisma** - ORM para bancos de dados
- **Swagger/OpenAPI** - Documentação interativa

## 🏗️ Arquitetura do Backend

O backend segue um **padrão modular baseado em entidades**, cada módulo contém:

```
src/modules/[Entidade]/
├── dto/                      # Data Transfer Objects
│   ├── Create[Entidade]Input.ts
│   ├── Update[Entidade]Input.ts
│   ├── [Entidade]Output.ts
│   └── index.ts
├── entities/                 # Entidades e interfaces
│   ├── [Entidade].ts
│   └── index.ts
├── [Entidade]Service.ts     # Lógica de negócio
├── [Entidade]Resolver.ts    # GraphQL Resolvers e Type Defs
├── [Entidade]Module.ts      # Exportações do módulo
└── index.ts                  # Barrel export
```

### Exemplo: Módulo Incidente

```
src/modules/Incidente/
├── dto/
│   ├── CreateIncidenteInput.ts
│   ├── UpdateIncidenteInput.ts
│   ├── IncidenteOutput.ts
│   └── index.ts
├── entities/
│   ├── Incidente.ts          # Interface e classe da entidade
│   └── index.ts
├── IncidenteService.ts       # Lógica de negócio (CRUD)
├── IncidenteResolver.ts      # GraphQL queries, mutations
├── IncidenteModule.ts        # Exporte centralizado
└── index.ts
```

## 📁 Estrutura Completa do Backend

```
Back_End/
├── src/
│   ├── lib/
│   │   └── prisma.ts                # Instância do Prisma Client
│   ├── graphql/
│   │   └── index.ts                 # Centraliza todos os módulos GraphQL
│   ├── pages/
│   │   ├── api/
│   │   │   ├── graphql.ts           # Endpoint GraphQL
│   │   │   └── swagger.ts           # Endpoint Swagger
│   │   ├── api-docs.tsx             # UI de documentação
│   │   ├── _app.tsx                 # App component
│   │   └── index.tsx                # Página inicial
│   └── modules/
│       └── Incidente/               # Módulo da entidade Incidente
│           ├── dto/
│           ├── entities/
│           ├── IncidenteService.ts
│           ├── IncidenteResolver.ts
│           ├── IncidenteModule.ts
│           └── index.ts
├── prisma/
│   └── schema.prisma                # Schema do banco de dados
├── package.json
├── tsconfig.json
├── next.config.js
├── .env.example
├── .eslintrc.json
├── .gitignore
├── README.md                        # Documentação do Backend
├── GETTING_STARTED.md              # Guia de início rápido
└── ARCHITECTURE.md                  # Detalhes da arquitetura
```

## 🎯 Vantagens da Arquitetura Modular

- ✅ **Escalabilidade** - Fácil adicionar novos módulos/entidades
- ✅ **Manutenibilidade** - Código organizado por domínio
- ✅ **Reutilização** - DTOs, Services e Entities isolados
- ✅ **Testabilidade** - Cada módulo pode ser testado independentemente
- ✅ **Documentação** - Estrutura clara e autodocumentada
- ✅ **Microserviços** - Preparado para evoluir para microserviços

## 🔧 Instalação e Setup

### Pré-requisitos
- Node.js v18+
- npm ou yarn
- PostgreSQL (ou outro banco compatível com Prisma)

### Passos

1. **Instale o Node.js** de [nodejs.org](https://nodejs.org)

2. **Navegue para o backend:**
   ```bash
   cd Back_End
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Configure variáveis de ambiente:**
   ```bash
   cp .env.example .env.local
   ```
   Edite `.env.local` e configure o `DATABASE_URL`

5. **Gere o Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

6. **Execute as migrações:**
   ```bash
   npm run prisma:migrate
   ```

7. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

## 📡 Endpoints da API

| Endpoint                            | Descrição            |
| ----------------------------------- | -------------------- |
| `http://localhost:3000`             | Página inicial       |
| `http://localhost:3000/api/graphql` | GraphQL Playground   |
| `http://localhost:3000/api-docs`    | Documentação Swagger |
| `http://localhost:3000/api/swagger` | OpenAPI JSON         |

## 🔍 Queries GraphQL

### Listar Incidentes
```graphql
query {
  incidentes {
    id
    createdAt
    updatedAt
  }
}
```

### Buscar Incidente por ID
```graphql
query {
  incidente(id: "seu-id") {
    id
    createdAt
    updatedAt
  }
}
```

### Criar Incidente
```graphql
mutation {
  createIncidente(input: {}) {
    id
    createdAt
    updatedAt
  }
}
```

### Atualizar Incidente
```graphql
mutation {
  updateIncidente(input: { id: "seu-id" }) {
    id
    updatedAt
  }
}
```

### Deletar Incidente
```graphql
mutation {
  deleteIncidente(id: "seu-id")
}
```

## 📚 Documentação Adicional

Consulte os arquivos no diretório `Back_End/`:
- **[GETTING_STARTED.md](Back_End/GETTING_STARTED.md)** - Guia passo a passo
- **[ARCHITECTURE.md](Back_End/ARCHITECTURE.md)** - Detalhes técnicos da arquitetura
- **[README.md](Back_End/README.md)** - Documentação completa do Backend

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia o servidor em modo desenvolvimento
npm run build           # Build para produção
npm start               # Inicia servidor de produção

# Banco de dados
npm run prisma:generate # Gera Prisma Client
npm run prisma:migrate  # Executa migrações
npm run prisma:studio   # Abre Prisma Studio

# Qualidade de código
npm run lint            # Executa linter
npm run type-check      # Verifica tipos TypeScript
```

## 🔐 Autenticação e Autorização

Atualmente **NÃO** implementado. Será adicionado em versões futuras.

## 📝 Modelo Atual

### Incidente
- `id` (String, único)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

> Atributos adicionais serão configurados posteriormente conforme o requisito.

## 🚦 Próximos Passos

- [ ] Adicionar autenticação e autorização
- [ ] Implementar validação de inputs
- [ ] Adicionar paginação e filtering
- [ ] Configurar testes unitários
- [ ] Implementar logging estruturado
- [ ] Adicionar rate limiting
- [ ] Configurar CI/CD

## 👥 Contribuindo

Este é um projeto de desafio/aprendizado. Contribuições são bem-vindas!

## 📄 Licença

MIT
