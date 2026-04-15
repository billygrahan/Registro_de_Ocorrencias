# 🚀 Quick Reference - MongoDB Setup

Resumo dos comandos necessários.

## 1️⃣ Configuração Inicial

### .env.local

```env
DATABASE_URL="mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/registro_ocorrencias?retryWrites=true&w=majority"
NODE_ENV="development"
```

### prisma/schema.prisma

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Incidente {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 2️⃣ Comandos do Projeto

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar e aplicar migração
npm run prisma:migrate dev --name init

# Abrir Prisma Studio (interface visual)
npm run prisma:studio

# Iniciar servidor
npm run dev

# Lint
npm run lint

# Type check
npm run type-check
```

## 3️⃣ URLs Importantes

```
🏠 Home: http://localhost:3000
📡 GraphQL: http://localhost:3000/api/graphql
📚 Docs: http://localhost:3000/api-docs
🛠️ Studio: http://localhost:5555
```

## 4️⃣ Testar Conexão

### GraphQL Query

```graphql
query {
  incidentes {
    id
    createdAt
    updatedAt
  }
}
```

### GraphQL Mutation

```graphql
mutation {
  createIncidente(input: {}) {
    id
    createdAt
    updatedAt
  }
}
```

## 5️⃣ Adicionar Novo Modelo

1. Edite `prisma/schema.prisma`:
   ```prisma
   model NovoModelo {
     id        String   @id @default(auto()) @map("_id") @db.ObjectId
     campo     String
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

2. Create migration:
   ```bash
   npm run prisma:migrate dev --name add_novo_modelo
   ```

3. Crie pasta do módulo:
   ```bash
   mkdir -p src/modules/NovoModelo/{dto,entities}
   ```

4. Siga padrão do Incidente (veja MODULES.md)

## 6️⃣ MongoDB Atlas Links

- Dashboard: https://cloud.mongodb.com
- Documentação: https://docs.atlas.mongodb.com
- Connection String Help: https://docs.atlas.mongodb.com/driver-connection

## 7️⃣ Troubleshoot Rápido

| Erro                    | Solução                       |
| ----------------------- | ----------------------------- |
| `ENOTFOUND`             | Verifique connection string   |
| `authentication failed` | Cheque username/senha         |
| `no IP whitelisted`     | Adicione IP em Network Access |
| `connection timeout`    | Aguarde cluster ficar ativo   |

## 8️⃣ Estrutura MongoDB vs SQL

```
MongoDB                PostgreSQL
════════════════════════════════════

Database              Database
  ↓                     ↓
Collection        →   Table
  ↓                     ↓
Document          →   Row
  ↓                     ↓
Field             →   Column
```

## 9️⃣ String de Conexão - Componentes

```
mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/database?options
│             │      │       │                           │         │
│             │      │       │                           │         └─ Opções de conexão
│             │      │       │                           └─────────── Nome do banco
│             │      │       └───────────────────────────────────── URL do Host
│             │      └──────────────────────────────────────────── Senha
│             └─────────────────────────────────────────────────── Usuário
└──────────────────────────────────────────────────────────────── Protocolo
```

## 🔟 Status Check

```bash
# Verificar variáveis de ambiente
cat .env.local

# Verificar Prisma
npx prisma --version

# Verificar Node
node --version

# Verificar npm
npm --version
```

---

**Próximo passo:** Leia `MONGODB_SETUP.md` para guia completo! 📖
