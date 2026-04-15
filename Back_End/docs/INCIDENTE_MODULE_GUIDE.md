# Módulo Incidente - Estrutura Completa

## 📋 Resumo das Mudanças

Todo o módulo Incidente foi ajustado para suportar uma estrutura CRUD completa com decorators type-graphql. Aqui está um resumo das mudanças:

---

## 🏗️ Estrutura do Projeto

```
Back_End/src/modules/Incidente/
├── entities/
│   ├── Incidente.ts          ← Entidade com @ObjectType e interface IIncidente
│   └── index.ts
├── dto/
│   ├── CreateIncidenteInput.ts   ← @InputType para criação
│   ├── UpdateIncidenteInput.ts   ← @InputType para atualização
│   ├── IncidenteOutput.ts        ← @ObjectType para saída
│   └── index.ts
├── IncidenteResolver.ts      ← @Resolver com @Query e @Mutation
├── IncidenteService.ts       ← Lógica de negócio (CRUD)
├── IncidenteModule.ts        ← Exportações do módulo
└── index.ts                  ← Exportações centralizadas
```

---

## 📊 Atributos da Entidade Incidente

- **id** `String` - Identificador único (criado automaticamente pelo MongoDB)
- **description** `String` - Descrição do incidente
- **tipo** `String` (enum) - PREVENTIVA, CORRETIVA, PLANEJADA
- **machineName** `String` (enum) - MAQUINA_01, MAQUINA_02, MAQUINA_03, MAQUINA_04, MAQUINA_05
- **status** `String` (enum) - EM_ABERTO, CONCLUIDO (padrão: EM_ABERTO)
- **createdAt** `Date` - Data de criação (gerada automaticamente)
- **finishedAt** `Date?` - Data de conclusão (null até o incidente ser finalizado)
- **updatedAt** `Date` - Data da última atualização (gerada automaticamente)

---

## 🔍 Decorators Utilizados

### Entidade (Incidente.ts)
```typescript
@ObjectType()           ← Marca a classe como tipo GraphQL
@Field()               ← Marca propriedade como campo GraphQL
@Field(() => Date, { nullable: true })  ← Campo opcional/nulável
```

### DTOs (CreateIncidenteInput, UpdateIncidenteInput)
```typescript
@InputType()           ← Marca classe como tipo de entrada GraphQL
@Field()              ← Campo obrigatório
@Field({ nullable: true })  ← Campo opcional
```

### Resolver (IncidenteResolver.ts)
```typescript
@Resolver(() => Incidente)     ← Define o tipo que o resolver resolve
@Query(() => [Incidente])      ← Define uma Query GraphQL
@Mutation(() => Incidente)     ← Define uma Mutation GraphQL
@Arg('id')                     ← Define um argumento
@Arg('input', () => CreateIncidenteInput)  ← Argumento complexo
```

---

## 📝 Queries Disponíveis

### 1. Listar todos os incidentes
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
```

### 2. Buscar incidente por ID
```graphql
query {
  incidente(id: "123") {
    id
    description
    tipo
    status
  }
}
```

### 3. Buscar por status
```graphql
query {
  incidentesByStatus(status: "EM_ABERTO") {
    id
    description
  }
}
```

### 4. Buscar por tipo
```graphql
query {
  incidentesByTipo(tipo: "CORRETIVA") {
    id
    machineName
  }
}
```

### 5. Buscar por máquina
```graphql
query {
  incidentesByMachineName(machineName: "MAQUINA_01") {
    id
    description
    tipo
  }
}
```

---

## ✍️ Mutations Disponíveis

### 1. Criar novo incidente
```graphql
mutation {
  criarIncidente(input: {
    description: "Falha no motor"
    tipo: "CORRETIVA"
    machineName: "MAQUINA_01"
  }) {
    id
    description
    status
    createdAt
  }
}
```

### 2. Atualizar incidente
```graphql
mutation {
  atualizarIncidente(input: {
    id: "123"
    description: "Descrição atualizada"
    status: "EM_ABERTO"
  }) {
    id
    description
    updatedAt
  }
}
```

### 3. Marcar como concluído
```graphql
mutation {
  concluirIncidente(id: "123") {
    id
    status
    finishedAt
  }
}
```

### 4. Deletar incidente
```graphql
mutation {
  deletarIncidente(id: "123")
}
```

---

## 🛠️ Métodos do Service (IncidenteService.ts)

- `findAll()` - Retorna todos os incidentes ordenados por data de criação (desc)
- `findById(id)` - Busca um incidente específico
- `findByStatus(status)` - Busca incidentes por status
- `findByTipo(tipo)` - Busca incidentes por tipo
- `findByMachineName(machineName)` - Busca incidentes por máquina
- `create(data)` - Cria um novo incidente (status padrão: EM_ABERTO)
- `update(id, data)` - Atualiza um incidente existente
- `markAsFinished(id)` - Marca incidente como concluído com timestamp
- `delete(id)` - Deleta um incidente

---

## 🗄️ Schema Prisma

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

## 🚀 Próximas Etapas

1. **Gerar Prisma Client**: `npm run prisma:generate`
2. **Fazer Deploy do Schema**: `npm run prisma:push`
3. **Testar as Queries/Mutations** no GraphQL Playground: `http://localhost:3000/api/graphql`
4. **Validações**: Adicionar validações customizadas se necessário

---

## 📚 Padrão Arquitetural

O projeto segue o padrão **Clean Architecture**:

- **Entities** (Incidente.ts) - Define a estrutura de dados
- **DTO** - Define estrutura de entrada/saída
- **Resolver** - Define endpoints GraphQL (orquestra o fluxo)
- **Service** - Contém lógica de negócio (interage com Prisma)
- **Prisma** - Camada de persistência (interage com MongoDB)

---

## 💡 Uso de Decorators

Os decorators do `type-graphql` facilitam:
- **Type Safety** - Tipos TypeScript automáticos
- **Documentação Automática** - Schema GraphQL gerado automaticamente
- **Validação** - Suporte para validadores customizados
- **Reusabilidade** - Reutilizar tipos em múltiplos contextos
