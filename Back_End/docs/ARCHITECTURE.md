# Arquitetura e Padrões do Projeto

## 🏗️ Visão Geral - Arquitetura Modular

O projeto segue uma **arquitetura de módulos baseada em domínios**, onde cada entidade (Incidente, Usuário, etc.) encapsula toda sua lógica em uma única pasta.

Esse padrão é:
- **Escalável** - adicione novos módulos sem afetar os existentes
- **Manutenível** - encontre tudo relacionado a uma entidade em um único lugar
- **Testável** - cada módulo é uma unidade independente
- **Pronto para Microserviços** - fácil extrair um módulo como serviço separado

## 📊 Estrutura em Camadas por Módulo

```
┌──────────────────────────────────┐
│    API GraphQL (Resolver)        │  ← Recebe requisições HTTP/GraphQL
├──────────────────────────────────┤
│    Service (Lógica Negócio)      │  ← Processamento, regras de negócio
├──────────────────────────────────┤
│    Prisma ORM (Persistência)     │  ← Acesso ao banco de dados
├──────────────────────────────────┤
│    Banco de Dados (PostgreSQL)   │  ← Armazenamento persistente
└──────────────────────────────────┘
```

## 📁 Hierarquia de Pastas

### 1. Módulo (ex: `src/modules/Incidente/`)

Cada módulo é uma pasta que contém **TODA** a lógica relacionada a uma entidade.

```
src/modules/[NomeEntidade]/
├── dto/                              # Data Transfer Objects
├── entities/                         # Modelos e interfaces
├── [NomeEntidade]Service.ts         # Lógica de negócio
├── [NomeEntidade]Resolver.ts        # GraphQL
├── [NomeEntidade]Module.ts          # Exportações centralizadas
└── index.ts                          # Barrel export
```

### 2. DTOs (`dto/` folder)

Dividem-se em 3 tipos, cada um em seu próprio arquivo:

**CreateInput** - Dados para CRIAR
```typescript
// CreateIncidenteInput.ts
export class CreateIncidenteInput {
  titulo: string
  descricao: string
}
```

**UpdateInput** - Dados para ATUALIZAR
```typescript
// UpdateIncidenteInput.ts
export class UpdateIncidenteInput {
  id: string
  titulo?: string  // campos opcionais
}
```

**Output** - Dados de RESPOSTA
```typescript
// IncidenteOutput.ts
export class IncidenteOutput {
  id: string
  titulo: string
  descricao: string
  createdAt: Date
  updatedAt: Date
}
```

**Benefícios:**
- DTOs separados por responsabilidade
- Fácil validar cada tipo
- Reutilizável em múltiplos contextos
- Clara documentação de interface

### 3. Entities (`entities/` folder)

Define a estrutura de dados da entidade:

```typescript
// Incidente.ts
export interface IIncidente {
  id: string
  titulo: string
  createdAt: Date
  updatedAt: Date
}

export class Incidente implements IIncidente {
  id: string
  titulo: string
  createdAt: Date
  updatedAt: Date

  constructor(data: Partial<IIncidente> = {}) {
    this.id = data.id || ''
    this.titulo = data.titulo || ''
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }
}
```

**Benefícios:**
- Interface clara do contrato
- Classe para criar instâncias tipadas
- Métodos de negócio podem ir aqui

### 4. Service (`[NomeEntidade]Service.ts`)

Contém **TODA** a lógica de negócio e operações CRUD:

```typescript
export class IncidenteService {
  // Query operations
  async findAll() { }
  async findById(id: string) { }
  
  // Mutations
  async create(data: CreateIncidenteInput) { }
  async update(id: string, data: UpdateIncidenteInput) { }
  async delete(id: string) { }
  
  // Business logic
  async marcarComoResolvido(id: string) { }
  async atribuirAOusuario(id: string, usuarioId: string) { }
}

// Singleton exportado
export const incidenteService = new IncidenteService()
```

**Responsabilidades:**
- ✅ Lógica de negócio complexa
- ✅ Validações
- ✅ Orquestração de operações
- ✅ Chamadas ao Prisma
- ❌ NÃO sabe sobre GraphQL
- ❌ NÃO sabe sobre HTTP

### 5. Resolver (`[NomeEntidade]Resolver.ts`)

Define GraphQL schema e implementa as resolver functions:

```typescript
export const incidenteTypeDefs = gql`
  type Incidente {
    id: ID!
    titulo: String!
    descricao: String
    createdAt: String!
  }
  
  type Query {
    incidentes: [Incidente!]!
    incidente(id: ID!): Incidente
  }
  
  type Mutation {
    createIncidente(input: CreateIncidenteInput!): Incidente!
  }
  
  input CreateIncidenteInput {
    titulo: String!
    descricao: String
  }
`

export const incidenteResolvers = {
  Query: {
    incidentes: async () => {
      return incidenteService.findAll()
    },
    incidente: async (_, { id }) => {
      return incidenteService.findById(id)
    }
  },
  
  Mutation: {
    createIncidente: async (_, { input }) => {
      return incidenteService.create(input)
    }
  }
}
```

**Responsabilidades:**
- ✅ Definir schema GraphQL
- ✅ Mapear GraphQL → Service
- ✅ Formatar respostas
- ❌ NÃO contém lógica de negócio
- ❌ NÃO acessa Prisma diretamente

### 6. Module (`[NomeEntidade]Module.ts`)

Centraliza todas as exportações do módulo:

```typescript
export const IncidenteModule = {
  graphql: {
    typeDefs: incidenteTypeDefs,
    resolvers: incidenteResolvers,
  },
  service: incidenteService,
  ServiceClass: IncidenteService,
  dto: {
    CreateIncidenteInput,
    UpdateIncidenteInput,
    IncidenteOutput,
  },
  entities: {
    Incidente,
    IIncidente,
  },
}
```

**Benefícios:**
- Single point of import
- Fácil ver o que o módulo exporta
- Centralizar configurações

### 7. Barrel Export (`index.ts`)

Simplifica imports re-exportando tudo:

```typescript
// src/modules/Incidente/index.ts
export * from './IncidenteService'
export * from './IncidenteResolver'
export * from './IncidenteModule'
export * from './dto'
export * from './entities'
```

**Uso:**
```typescript
// Ao invés de:
import { incidenteService } from '../modules/Incidente/IncidenteService'
import { CreateIncidenteInput } from '../modules/Incidente/dto/CreateIncidenteInput'

// Use:
import { incidenteService, CreateIncidenteInput } from '@/modules/Incidente'
```

## 🔗 Fluxo de Requisição GraphQL

```
1. Cliente envia query GraphQL
   ↓
2. Next.js API route `/api/graphql` recebe
   ↓
3. Apollo Server processa a query
   ↓
4. Resolver GraphQL é chamado
   ├─ Valida inputs
   ├─ Chama Service
   │
5. Service processa a lógica de negócio
   ├─ Validações complexas
   ├─ Orquestração
   ├─ Chama Prisma
   │
6. Prisma executa query no banco
   ↓
7. Service retorna dados
   ↓
8. Resolver formata para GraphQL
   ↓
9. Apollo Server serializa JSON
   ↓
10. Resposta enviada ao cliente
```

## 📊 Padrão de Pastas vs. Funcionalidade

| Pasta         | Contém              | Conhece          | NÃO Conhece       |
| ------------- | ------------------- | ---------------- | ----------------- |
| `dto/`        | Interfaces de dados | Validação, tipos | Business logic    |
| `entities/`   | Modelos de dados    | Estrutura, tipos | Banco de dados    |
| `Service.ts`  | Lógica de negócio   | Prisma, DTOs     | GraphQL, HTTP     |
| `Resolver.ts` | GraphQL schema      | HTTP, formatação | Database          |
| `Module.ts`   | Exportações         | Tudo do módulo   | Nada (centraliza) |

## 🔄 Adicionando um Novo Módulo

Passo a passo para adicionar uma nova entidade (ex: Usuário):

### 1. Crie a estrutura
```bash
mkdir -p src/modules/Usuario/{dto,entities}
```

### 2. Crie os DTOs
Arquivo: `src/modules/Usuario/dto/CreateUsuarioInput.ts`
```typescript
export class CreateUsuarioInput {
  email: string
  nome: string
}
```

Similar para `UpdateUsuarioInput.ts` e `UsuarioOutput.ts`, depois crie `index.ts` para exportar.

### 3. Crie a Entidade
Arquivo: `src/modules/Usuario/entities/Usuario.ts`
```typescript
export interface IUsuario {
  id: string
  email: string
  nome: string
}

export class Usuario implements IUsuario {
  // ... implementação
}
```

Crie `index.ts` para exportar.

### 4. Crie o Service
Arquivo: `src/modules/Usuario/UsuarioService.ts`
```typescript
export class UsuarioService {
  async findAll() { }
  async findById(id: string) { }
  async create(data: CreateUsuarioInput) { }
  // ... mais métodos
}

export const usuarioService = new UsuarioService()
```

### 5. Crie o Resolver
Arquivo: `src/modules/Usuario/UsuarioResolver.ts`
```typescript
export const usuarioTypeDefs = gql`...`
export const usuarioResolvers = { ... }
```

### 6. Crie o Module
Arquivo: `src/modules/Usuario/UsuarioModule.ts`
```typescript
export const UsuarioModule = {
  graphql: { typeDefs, resolvers },
  service,
  ServiceClass,
  dto: { ... },
  entities: { ... },
}
```

### 7. Exporte o Module
Arquivo: `src/modules/Usuario/index.ts`
```typescript
export * from './UsuarioService'
export * from './UsuarioResolver'
export * from './UsuarioModule'
export * from './dto'
export * from './entities'
```

### 8. Registre em GraphQL
Arquivo: `src/graphql/index.ts`
```typescript
import { UsuarioModule } from '@/modules/Usuario'

export const typeDefs = [
  IncidenteModule.graphql.typeDefs,
  UsuarioModule.graphql.typeDefs,  // ← adicione
]

export const resolvers = [
  IncidenteModule.graphql.resolvers,
  UsuarioModule.graphql.resolvers,  // ← adicione
]
```

### 9. Configure Prisma
Arquivo: `prisma/schema.prisma`
```prisma
model Usuario {
  id    String  @id @default(cuid())
  email String  @unique
  nome  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 10. Execute Migrações
```bash
npm run prisma:migrate
```

✅ Pronto! O novo módulo está integrado!

## 💡 Boas Práticas

### ✅ FAÇA

- Use Services para toda lógica de negócio
- Mantenha Resolvers simples (apenas chamam services)
- DTOs em arquivos separados para clareza
- Importe usando path aliases (`@/modules/`)
- Centralize exports em `index.ts` (barrel exports)
- Documente com comentários JSDoc
- Use tipos TypeScript em tudo

### ❌ NÃO FAÇA

- Lógica de negócio nos Resolvers
- Prisma direto nos Resolvers
- Mixar responsabilidades em um arquivo
- Imports profundos (`../../modules/...`)
- Usar `any` em tipos
- DTOs como Models do Prisma
- Ignorar erros

## 🧪 Testando Módulos

Cada módulo pode ser testado independentemente:

```typescript
// test/modules/Incidente.test.ts
import { incidenteService } from '@/modules/Incidente'
import { CreateIncidenteInput } from '@/modules/Incidente'

describe('IncidenteService', () => {
  it('should create an incidente', async () => {
    const input = new CreateIncidenteInput()
    const result = await incidenteService.create(input)
    expect(result.id).toBeDefined()
  })
})
```

## 🚀 Escalando para Microserviços

Com essa arquitetura, escalar para microserviços é simples:

1. Crie um novo serviço Node/GraphQL
2. Copie a pasta `src/modules/NomeEntidade/`
3. Configure Prisma com seu próprio banco
4. Inicie um serviço separado para essa entidade

O módulo continua funcionando da mesma forma!

## 📊 Diagrama de Dependências

```
┌─────────────────────────────┐
│     src/graphql/index.ts    │  (centraliza tudo)
├─────────────────────────────┤
│ src/modules/Incidente/      │
│ src/modules/Usuario/        │
│ src/modules/...             │
├─────────────────────────────┤
│     src/lib/prisma.ts       │  (compartilhado)
├─────────────────────────────┤
│     DATABASE (PostgreSQL)   │
└─────────────────────────────┘
```

## 🎯 Resumo

| Conceito       | Localização                    | Responsabilidade   |
| -------------- | ------------------------------ | ------------------ |
| DTOs           | `modules/[Entity]/dto/`        | Validar dados      |
| Entities       | `modules/[Entity]/entities/`   | Estrutura de dados |
| Business Logic | `modules/[Entity]/Service.ts`  | Lógica e CRUD      |
| GraphQL Schema | `modules/[Entity]/Resolver.ts` | API contract       |
| Centralização  | `modules/[Entity]/Module.ts`   | Exportar tudo      |

Essa arquitetura é **modular, escalável, e preparada para crescimento**. 🚀
