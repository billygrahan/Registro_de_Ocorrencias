# 📋 Como Adicionar um Novo Módulo

Este guia explica passo a passo como adicionar uma nova entidade ao backend.

## 🎯 Exemplo: Adicionando o módulo "Usuario"

### Passo 1: Crie a estrutura de pastas

```bash
cd src/modules
mkdir -p Usuario/{dto,entities}
```

### Passo 2: Crie os DTOs

**Arquivo:** `src/modules/Usuario/dto/CreateUsuarioInput.ts`
```typescript
export class CreateUsuarioInput {
  email: string
  nome: string
  // Adicione mais campos conforme necessário
}
```

**Arquivo:** `src/modules/Usuario/dto/UpdateUsuarioInput.ts`
```typescript
export class UpdateUsuarioInput {
  id: string
  email?: string
  nome?: string
  // Campos opcionais
}
```

**Arquivo:** `src/modules/Usuario/dto/UsuarioOutput.ts`
```typescript
export class UsuarioOutput {
  id: string
  email: string
  nome: string
  createdAt: Date
  updatedAt: Date
}

export default UsuarioOutput
```

**Arquivo:** `src/modules/Usuario/dto/index.ts`
```typescript
export { CreateUsuarioInput } from './CreateUsuarioInput'
export { UpdateUsuarioInput } from './UpdateUsuarioInput'
export { UsuarioOutput } from './UsuarioOutput'
```

### Passo 3: Crie a Entidade

**Arquivo:** `src/modules/Usuario/entities/Usuario.ts`
```typescript
export interface IUsuario {
  id: string
  email: string
  nome: string
  createdAt: Date
  updatedAt: Date
}

export class Usuario implements IUsuario {
  id: string
  email: string
  nome: string
  createdAt: Date
  updatedAt: Date

  constructor(data: Partial<IUsuario> = {}) {
    this.id = data.id || ''
    this.email = data.email || ''
    this.nome = data.nome || ''
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }
}

export default Usuario
```

**Arquivo:** `src/modules/Usuario/entities/index.ts`
```typescript
export { Usuario, IUsuario } from './Usuario'
```

### Passo 4: Crie o Service

**Arquivo:** `src/modules/Usuario/UsuarioService.ts`
```typescript
import { prisma } from '@/lib/prisma'
import { CreateUsuarioInput, UpdateUsuarioInput } from './dto'

export class UsuarioService {
  async findAll() {
    return prisma.usuario.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findById(id: string) {
    return prisma.usuario.findUnique({
      where: { id },
    })
  }

  async create(data: CreateUsuarioInput) {
    return prisma.usuario.create({
      data: {
        email: data.email,
        nome: data.nome,
      },
    })
  }

  async update(id: string, data: UpdateUsuarioInput) {
    return prisma.usuario.update({
      where: { id },
      data: {
        email: data.email,
        nome: data.nome,
      },
    })
  }

  async delete(id: string) {
    return prisma.usuario.delete({
      where: { id },
    })
  }

  // Adicione métodos de negócio específicos aqui
  async findByEmail(email: string) {
    return prisma.usuario.findUnique({
      where: { email },
    })
  }
}

export const usuarioService = new UsuarioService()
```

### Passo 5: Crie o Resolver

**Arquivo:** `src/modules/Usuario/UsuarioResolver.ts`
```typescript
import { gql } from 'apollo-server-micro'
import { usuarioService } from './UsuarioService'

export const usuarioTypeDefs = gql`
  type Usuario {
    id: ID!
    email: String!
    nome: String!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    usuarios: [Usuario!]!
    usuario(id: ID!): Usuario
    usuarioByEmail(email: String!): Usuario
  }

  extend type Mutation {
    createUsuario(input: CreateUsuarioInput!): Usuario!
    updateUsuario(input: UpdateUsuarioInput!): Usuario
    deleteUsuario(id: ID!): Boolean!
  }

  input CreateUsuarioInput {
    email: String!
    nome: String!
  }

  input UpdateUsuarioInput {
    id: ID!
    email: String
    nome: String
  }
`

export const usuarioResolvers = {
  Query: {
    usuarios: async () => {
      const usuarios = await usuarioService.findAll()
      return usuarios.map((usuario) => ({
        ...usuario,
        createdAt: usuario.createdAt.toISOString(),
        updatedAt: usuario.updatedAt.toISOString(),
      }))
    },

    usuario: async (_: any, { id }: { id: string }) => {
      const usuario = await usuarioService.findById(id)
      if (!usuario) return null

      return {
        ...usuario,
        createdAt: usuario.createdAt.toISOString(),
        updatedAt: usuario.updatedAt.toISOString(),
      }
    },

    usuarioByEmail: async (_: any, { email }: { email: string }) => {
      const usuario = await usuarioService.findByEmail(email)
      if (!usuario) return null

      return {
        ...usuario,
        createdAt: usuario.createdAt.toISOString(),
        updatedAt: usuario.updatedAt.toISOString(),
      }
    },
  },

  Mutation: {
    createUsuario: async (_: any, { input }: any) => {
      const usuario = await usuarioService.create(input)

      return {
        ...usuario,
        createdAt: usuario.createdAt.toISOString(),
        updatedAt: usuario.updatedAt.toISOString(),
      }
    },

    updateUsuario: async (_: any, { input }: any) => {
      const { id, ...data } = input
      const usuario = await usuarioService.update(id, data)

      return {
        ...usuario,
        createdAt: usuario.createdAt.toISOString(),
        updatedAt: usuario.updatedAt.toISOString(),
      }
    },

    deleteUsuario: async (_: any, { id }: { id: string }) => {
      try {
        await usuarioService.delete(id)
        return true
      } catch {
        return false
      }
    },
  },
}
```

### Passo 6: Crie o Module

**Arquivo:** `src/modules/Usuario/UsuarioModule.ts`
```typescript
import { usuarioResolvers, usuarioTypeDefs } from './UsuarioResolver'
import { UsuarioService, usuarioService } from './UsuarioService'
import { CreateUsuarioInput, UpdateUsuarioInput, UsuarioOutput } from './dto'
import { Usuario, IUsuario } from './entities'

export const UsuarioModule = {
  graphql: {
    typeDefs: usuarioTypeDefs,
    resolvers: usuarioResolvers,
  },

  service: usuarioService,
  ServiceClass: UsuarioService,

  dto: {
    CreateUsuarioInput,
    UpdateUsuarioInput,
    UsuarioOutput,
  },

  entities: {
    Usuario,
    IUsuario,
  },
}

export default UsuarioModule
```

### Passo 7: Exporte o Module

**Arquivo:** `src/modules/Usuario/index.ts`
```typescript
export * from './UsuarioService'
export * from './UsuarioResolver'
export * from './UsuarioModule'
export * from './dto'
export * from './entities'
```

### Passo 8: Registre em GraphQL Central

**Edite:** `src/graphql/index.ts`

Adicione a importação:
```typescript
import { UsuarioModule } from '@/modules/Usuario'
```

Atualize os arrays:
```typescript
export const typeDefs = [
  IncidenteModule.graphql.typeDefs,
  UsuarioModule.graphql.typeDefs,  // ← novo
]

export const resolvers = [
  IncidenteModule.graphql.resolvers,
  UsuarioModule.graphql.resolvers,  // ← novo
]
```

### Passo 9: Configure Prisma

**Edite:** `prisma/schema.prisma`

Adicione o modelo:
```prisma
model Usuario {
  id    String  @id @default(cuid())
  email String  @unique
  nome  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Passo 10: Execute Migrações

```bash
npm run prisma:generate
npm run prisma:migrate
```

## ✅ Pronto!

Seu novo módulo está integrado ao backend! Você pode:

- Acessar em GraphQL: `http://localhost:3000/api/graphql`
- Testar queries e mutations
- Visualizar no Swagger: `http://localhost:3000/api-docs`

## 📝 Checklist para Novo Módulo

- [ ] Pastas criadas (dto, entities)
- [ ] DTOs definidos (Create, Update, Output)
- [ ] Entidade criada (interface + classe)
- [ ] Service com CRUD
- [ ] Resolver com typeDefs e resolvers
- [ ] Module exportando tudo
- [ ] index.ts do módulo com barrel export
- [ ] Importado em `src/graphql/index.ts`
- [ ] Model adicionado em `prisma/schema.prisma`
- [ ] Migrações executadas

## 💡 Dicas

- Use o módulo Incidente como referência
- Mantenha Services sem lógica de GraphQL
- Sempre formate datas como ISO strings
- Use path aliases (`@/modules/`)
- Documente com comentários JSDoc
- Teste cada função enquanto desenvolve
