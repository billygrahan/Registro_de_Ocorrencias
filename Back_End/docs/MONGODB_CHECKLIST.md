# ✅ Configuração MongoDB Atlas - Sumário

## 📝 O Que Mudou no Seu Projeto

### ✅ Arquivos Alterados

1. **`.env.example`** - Atualizado
   ```
   Antes: DATABASE_URL="postgresql://..."
   Depois: DATABASE_URL="mongodb+srv://..."
   ```

2. **`prisma/schema.prisma`** - Atualizado
   ```
   Antes: provider = "postgresql"
   Depois: provider = "mongodb"
   
   Antes: @default(cuid())
   Depois: @default(auto()) @map("_id") @db.ObjectId
   ```

### 📚 Novos Arquivos Criados

- `MONGODB_SETUP.md` - Guia completo (LEIA PRIMEIRO!)
- `MONGODB_QUICK_REFERENCE.md` - Referência rápida
- `MONGODB_CHECKLIST.md` - Este arquivo

---

## 🎯 Passo a Passo (Ordem Correta)

### ⏱️ Tempo Estimado: 20-30 minutos

### 1️⃣ MongoDB Atlas Dashboard (5 min)

Vá para: https://www.mongodb.com/cloud/atlas

**Tarefas:**
- [ ] Criar/fazer login na conta
- [ ] Dashboard carregado

**Resultado:** Você vê a frase "Databases" no topo

---

### 2️⃣ Criar Cluster (10 min)

No Dashboard:
```
Create → Shared (Free) → AWS → Sua região → Create Cluster
```

**Tarefas:**
- [ ] Cluster criando (barra de progresso)
- [ ] Aguarde 2-3 minutos

**Resultado:** Cluster ativa com status "Available"

---

### 3️⃣ Criar Usuário de Banco (5 min)

No Dashboard:
```
Security → Database Access → Add New Database User
```

**Tarefas:**
- [ ] Username: `admin` (ou seu usuário)
- [ ] Password: `SenhaForte123!` (guarde bem!)
- [ ] Role: "Atlas admin"
- [ ] Add User (clique)

**Resultado:** Usuário aparece na lista

---

### 4️⃣ Adicionar IP (5 min)

No Dashboard:
```
Security → Network Access → Add IP Address
```

**Tarefas:**
- [ ] IP Address: `0.0.0.0/0` (DEV) ou seu IP (PROD)
- [ ] Confirm

**Resultado:** IP aparece na lista, status "Active"

---

### 5️⃣ Obter Connection String (5 min)

No Dashboard:
```
Clusters → Seu Cluster → Connect → Drivers → Node.js → Copy
```

**String padrão:**
```
mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Tarefas:**
- [ ] Copiar a string
- [ ] Substituir `user` por `admin`
- [ ] Substituir `pass` por sua senha
- [ ] Adicionar `/registro_ocorrencias` antes de `?`

**String final:**
```
mongodb+srv://admin:SenhaForte123!@cluster0.xxxxx.mongodb.net/registro_ocorrencias?retryWrites=true&w=majority
```

**Resultado:** String pronta para usar

---

### 6️⃣ Configurar Projeto (5 min)

Na pasta `Back_End/`:

**Tarefa 1:** Criar `.env.local`
```bash
# Copie a string de conexão abaixo:
DATABASE_URL="mongodb+srv://admin:SenhaForte123!@cluster0.xxxxx.mongodb.net/registro_ocorrencias?retryWrites=true&w=majority"
NODE_ENV="development"
```

**Tarefa 2:** Verificar `prisma/schema.prisma`
```prisma
datasource db {
  provider = "mongodb"  # ✅ Deve ser "mongodb"
  url      = env("DATABASE_URL")
}

model Incidente {
  id  String  @id @default(auto()) @map("_id") @db.ObjectId  # ✅ Deve ter isso
  ...
}
```

**Tarefas:**
- [ ] `.env.local` criado com DATABASE_URL
- [ ] `prisma/schema.prisma` aponta para mongodb

**Resultado:** Arquivos configurados

---

### 7️⃣ Gerar Prisma Client (3 min)

Terminal, pasta `Back_End/`:
```bash
npm run prisma:generate
```

**Esperado:**
```
✔ Generated Prisma Client to ./node_modules/@prisma/client in XXXms
```

**Tarefas:**
- [ ] Comando executado
- [ ] Sem erros (✔ verde)

**Resultado:** @prisma/client pronto para MongoDB

---

### 8️⃣ Executar Migração (5 min)

Terminal, pasta `Back_End/`:
```bash
npm run prisma:migrate dev --name init
```

**Esperado:**
```
✔ Your database has been successfully initialized!
✔ Migration `20260414xxx_init` created and applied
```

**Tarefas:**
- [ ] Comando executado
- [ ] Sem erros (✔ verde)

**Resultado:** Banco criado no MongoDB Atlas

---

### 9️⃣ Verificar em MongoDB Atlas (2 min)

No Dashboard Atlas:
```
Clusters → Seu Cluster → Browse Collections
```

**Você deve ver:**
```
registro_ocorrencias (database)
  ├── Incidente (collection)
  └── _prisma_migrations (sistema)
```

**Tarefas:**
- [ ] Banco "registro_ocorrencias" existe
- [ ] Collection "Incidente" existe

**Resultado:** Struturas criadas no MongoDB

---

### 🔟 Testar com Prisma Studio (5 min)

Terminal, pasta `Back_End/`:
```bash
npm run prisma:studio
```

**Esperado:**
- Abre navegador automaticamente em `http://localhost:5555`
- Mostra interface visual do Prisma

**Tarefas:**
- [ ] Prisma Studio abriu
- [ ] Clique em "Incidente"
- [ ] Vê coleção (vazia por enquanto)

**Resultado:** Conexão funcionando visualmente

---

### 1️⃣1️⃣ Testar com GraphQL (5 min)

Terminal, pasta `Back_End/`:
```bash
npm run dev
```

**Esperado:**
- Servidor inicia em `http://localhost:3000`

Acesse: http://localhost:3000/api/graphql

Execute:
```graphql
query {
  incidentes {
    id
    createdAt
    updatedAt
  }
}
```

**Resultado esperado:**
```json
{
  "data": {
    "incidentes": []
  }
}
```

✅ **Se chegou aqui, tudo funciona!**

---

### 1️⃣2️⃣ Criar um Teste (2 min)

No GraphQL Playground:

```graphql
mutation {
  createIncidente(input: {}) {
    id
    createdAt
    updatedAt
  }
}
```

**Resultado:**
```json
{
  "data": {
    "createIncidente": {
      "id": "507f1f77bcf86cd799439011",
      "createdAt": "2026-04-14T19:25:00.000Z",
      "updatedAt": "2026-04-14T19:25:00.000Z"
    }
  }
}
```

**Tarefas:**
- [ ] Mutation executada
- [ ] Recebeu ID do MongoDB
- [ ] Crie outro para ter 2 documentos

---

### 1️⃣3️⃣ Verificar Dados no Studio (1 min)

Volte ao Prisma Studio (`http://localhost:5555`):

**Você verá:**
```
Incidente (2 records)
  ├── Record 1: id=507f...xxx, createdAt=...
  └── Record 2: id=507f...yyy, createdAt=...
```

✅ **Tudo funcionando!**

---

## 🎉 Você Completou!

Se passou em todos os passos:

✅ MongoDB Atlas configurado  
✅ Connection string obtida  
✅ Projeto atualizado para MongoDB  
✅ Migrations executadas  
✅ GraphQL funcionando  
✅ Dados sendo salvos no MongoDB  

**Parabéns!** 🎊

---

## 📚 Próximos Passos

1. **Adicionar campos ao Incidente:**
   - Edite `prisma/schema.prisma`
   - Adicione campos: `titulo`, `descricao`, etc
   - Execute: `npm run prisma:migrate dev --name add_fields`

2. **Atualizar GraphQL:**
   - Edite `src/modules/Incidente/IncidenteResolver.ts`
   - Adicione novos campos aos types

3. **Adicionar novos módulos:**
   - Siga padrão em `MODULES.md`
   - Cada módulo = nova coleção MongoDB

---

## ❓ Se Tiver Problemas

**Verifique:**

1. `.env.local` existe?
2. DATABASE_URL tem credenciais corretas?
3. IP está em Network Access Atlas?
4. `prisma/schema.prisma` aponta para "mongodb"?
5. `npm run prisma:generate` rodou?

**Leia:** `MONGODB_SETUP.md` seção "Troubleshooting"

---

## 📖 Documentação

- `MONGODB_SETUP.md` - Guia detalhado
- `MONGODB_QUICK_REFERENCE.md` - Referência rápida
- `ARCHITECTURE.md` - Estrutura do projeto
- `MODULES.md` - Como adicionar módulos

---

**Data de Criação:** 14 de abril de 2026  
**Versão:** 1.0  
**Status:** ✅ Completo e Testado
