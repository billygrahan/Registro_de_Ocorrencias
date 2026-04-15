# Migração para NestJS com GraphQL

## ✅ Concluído com Sucesso!

O projeto foi migrado de **Next.js + Apollo Server** para **NestJS + GraphQL** com decorators do `@nestjs/graphql`.

---

## 📋 Estrutura Final do Projeto

```
src/
├── main.ts                           ← Entry point da aplicação
├── app.module.ts                     ← Módulo raiz com GraphQL setup
├── app.controller.ts                 ← Controlador (opcional)
├── prisma/
│   └── prisma.service.ts            ← Serviço Prisma (gerencia conexão BD)
├── modules/
│   └── incidente/
│       ├── entities/
│       │   └── incidente.entity.ts   ← @ObjectType com decorators GraphQL
│       ├── dto/
│       │   ├── create-incidente.input.ts  ← @InputType para criação
│       │   ├── update-incidente.input.ts  ← @InputType para update
│       │   └── index.ts
│       ├── incidente.service.ts      ← Lógica de negócio (CRUD)
│       ├── incidente.resolver.ts     ← @Resolver com @Query e @Mutation
│       └── incidente.module.ts       ← Módulo NestJS encapsulado
├── schema.gql                        ← Schema GraphQL auto-gerado
└── prisma/
    └── schema.prisma                 ← Definição de dados MongoDB
```

---

## 🏗️ Decorators Utilizados

### Entidades (`@ObjectType`)
```typescript
@ObjectType()
export class Incidente {
  @Field(() => ID)
  id!: string

  @Field()
  description!: string

  @Field(() => Date, { nullable: true })
  finishedAt?: Date
}
```

### DTOs - Input Types (`@InputType`)
```typescript
@InputType()
export class CreateIncidenteInput {
  @Field()
  description!: string

  @Field()
  tipo!: string
}
```

### Resolvers (`@Resolver`, `@Query`, `@Mutation`)
```typescript
@Resolver(() => Incidente)
export class IncidenteResolver {
  @Query(() => [Incidente])
  async incidentes(): Promise<Incidente[]> {
    return this.incidenteService.findAll()
  }

  @Mutation(() => Incidente)
  async criarIncidente(
    @Args('input') input: CreateIncidenteInput,
  ): Promise<Incidente> {
    return this.incidenteService.create(input)
  }
}
```

---

## 📊 Schema Prisma (MongoDB)

```prisma
enum TipoIncidente {
  PREVENTIVA
  CORRETIVA
  PLANEJADA
}

enum StatusIncidente {
  EM_ABERTO
  CONCLUIDO
}

enum MachineNameEnum {
  MAQUINA_01
  MAQUINA_02
  MAQUINA_03
  MAQUINA_04
  MAQUINA_05
}

model Incidente {
  id          String            @id @default(auto()) @map("_id") @db.ObjectId
  description String
  tipo        TipoIncidente     @default(PREVENTIVA)
  machineName MachineNameEnum
  status      StatusIncidente   @default(EM_ABERTO)
  createdAt   DateTime          @default(now())
  finishedAt  DateTime?
  updatedAt   DateTime          @updatedAt
}
```

---

## 🚀 Rodando a Aplicação

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

### GraphQL Playground
Acesse: `http://localhost:3000/graphql`

---

## 📝 Queries Disponíveis

```graphql
query {
  incidentes {
    id
    description
    tipo
    machineName
    status
    createdAt
    finishedAt
    updatedAt
  }
}

query {
  incidente(id: "123") {
    id
    description
  }
}

query {
  incidentesByStatus(status: "EM_ABERTO") {
    id
    description
  }
}
```

---

## ✏️ Mutations Disponíveis

```graphql
mutation {
  criarIncidente(input: {
    description: "Falha no motor"
    tipo: "CORRETIVA"
    machineName: "MAQUINA_01"
  }) {
    id
    status
    createdAt
  }
}

mutation {
  atualizarIncidente(input: {
    id: "123"
    description: "Nova descrição"
    status: "CONCLUIDO"
  }) {
    id
    updatedAt
  }
}

mutation {
  concluirIncidente(id: "123") {
    id
    status
    finishedAt
  }
}

mutation {
  deletarIncidente(id: "123")
}
```

---

## 📦 Dependências Principais

- `@nestjs/common` - Framework NestJS
- `@nestjs/graphql` - Integração GraphQL
- `@nestjs/apollo` - Driver Apollo para NestJS
- `@nestjs/config` - Gerenciamento de variáveis de ambiente
- `@prisma/client` - ORM MongoDB
- `graphql` - Biblioteca GraphQL
- `apollo-server-express` - Servidor Apollo

---

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env.local`:
```
DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/db"
NODE_ENV="development"
```

---

## 📚 Padrão Arquitetural

**Clean Architecture + Dependency Injection (NestJS)**

- **Resolvers** - Definem endpoints GraphQL (DTO validation, auth)
- **Services** - Contêm lógica de negócio
- **Entities** - Definem tipos GraphQL e estrutura de dados
- **Prisma** - Camada de persistência (MongoDB)

---

## 🎯 Próximas Etapas

1. **Validação**: Adicionar `@nestjs/class-validator` para validar inputs
2. **Autenticação**: Adicionar JWT com `@nestjs/jwt`
3. **Permissões**: Implementar guards para autorização
4. **Testes**: Criar testes unitários com Jest
5. **Deploy**: Containerizar com Docker e fazer deploy

---

## ✨ Benefícios da Migração

✅ **Type Safety** - Tipos TypeScript automáticos em toda a aplicação  
✅ **Decorators** - Sintaxe limpa e declarativa  
✅ **Dependency Injection** - Gerenciamento de injeção nativa  
✅ **Modularização** - Estrutura de módulos encapsulada  
✅ **Auto-geração de Schema** - Schema GraphQL gerado automaticamente  
✅ **Validação Nativa** - Suporte para class-validator integrado  
✅ **Testing** - Melhor suporte para testes e mocks  
