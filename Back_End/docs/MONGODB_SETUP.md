# 🍃 Configuração MongoDB Atlas + Prisma

Guia completo para conectar seu backend ao MongoDB Atlas.

## 📋 Conteúdo

1. [Setup MongoDB Atlas](#1-setup-mongodb-atlas)
2. [Obter Connection String](#2-obter-connection-string)
3. [Configurar o Projeto](#3-configurar-o-projeto)
4. [Executar Migrações](#4-executar-migrações)
5. [Testar Conexão](#5-testar-conexão)
6. [Troubleshooting](#troubleshooting)

---

## 1. Setup MongoDB Atlas

### 1.1 Criar Conta

1. Acesse: https://www.mongodb.com/cloud/atlas
2. Clique em **"Try Free"** ou **"Start Free"**
3. Crie conta com:
   - Email
   - Ou Google/GitHub

### 1.2 Criar Cluster

Após fazer login:

```
Dashboard
└─ Create a Deployment
   ├─ Escolher: "Shared" (GRÁTIS) ✅
   ├─ Cloud Provider: "AWS" 
   ├─ Region: Escolha a mais próxima de você
   │  (ex: N. Virginia para USA, Ireland para Europa)
   └─ Create Cluster
```

**Aguarde 2-3 minutos enquanto o cluster é criado** ☕

### 1.3 Criar Usuário de Banco de Dados

```
Painel Esquerdo
└─ Security
   ├─ Database Access
   │  ├─ Add New Database User
   │  ├─ Username: seu_usuario
   │  ├─ Password: sua_senha (SALVE ISSO!)
   │  ├─ Built-in Role: "Atlas admin"
   │  └─ Add User
```

**Exemplo:**
- Username: `admin`
- Password: `SenhafortesuperSegura123!`

### 1.4 Permitir Seu IP (Network Access)

```
Painel Esquerdo
└─ Security
   ├─ Network Access
   │  ├─ Add IP Address
   │  ├─ Opção para Desenvolvimento: 0.0.0.0/0 (qualquer IP)
   │  │  (⚠️ Só para DEV! Em produção use IP específico)
   │  └─ Confirm
```

---

## 2. Obter Connection String

### 2.1 Acessar Cluster

```
Painel Principal
└─ Clusters
   └─ Seu Cluster (ex: "Cluster0")
      ├─ Botão "Connect"
      ├─ Escolher: "Drivers"
      ├─ Language: Node.js
      ├─ Driver: 4.1 or later
      └─ Copiar a string
```

### 2.2 Format da String

Você verá algo como:

```
mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Partes da string:**
```
mongodb+srv://
└─ Protocolo MongoDB Secure

usuario:senha
└─ Usuário e senha que criou

@cluster0.xxxxx.mongodb.net
└─ Seu cluster no Atlas

?retryWrites=true&w=majority
└─ Opções de replicação
```

### 2.3 Adaptar para Seu Banco

A string padrão não tem o nome do banco. **Você precisa adicionar:**

```
// Padrão (sem banco específico):
mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

// Com banco específico (USAR ISSO):
mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/registro_ocorrencias?retryWrites=true&w=majority
                                                        ↑
                                        Nome do banco (será criado automaticamente)
```

---

## 3. Configurar o Projeto

### 3.1 Criar `.env.local`

Na pasta `Back_End/`, crie arquivo `.env.local`:

```bash
# Copie a linha abaixo e substitua os valores
DATABASE_URL="mongodb+srv://admin:SenhafortesuperSegura123!@cluster0.xxxxx.mongodb.net/registro_ocorrencias?retryWrites=true&w=majority"
NODE_ENV="development"
```

**Exemplo completo:**

```env
DATABASE_URL="mongodb+srv://admin:SenhafortesuperSegura123!@cluster0.abc123def456.mongodb.net/registro_ocorrencias?retryWrites=true&w=majority"
NODE_ENV="development"
```

### 3.2 Verificar Prisma Schema

O arquivo `prisma/schema.prisma` foi atualizado para:

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

**O que mudou:**
- `provider`: `"postgresql"` → `"mongodb"` ✅
- `@default(cuid())` → `@default(auto())` ✅ (MongoDB usa ObjectId)
- `@map("_id")` → Mapeia para o ID nativo do MongoDB

---

## 4. Executar Migrações

### 4.1 Gerar Prisma Client

```bash
npm run prisma:generate
```

**Output esperado:**
```
✔ Generated Prisma Client (x.y.z) to ./node_modules/@prisma/client in XXXms

Start using Prisma Client in Node.js (See: http://pris.ly/d/prisma-client)
```

### 4.2 Sincronizar Schema

```bash
npm run prisma:migrate dev --name init
```

Ou se não tiver migrations anteriores:

```bash
npm run prisma:migrate dev --name first_migration
```

**O que vai acontecer:**
1. Prisma conecta ao MongoDB
2. Cria a coleção `Incidente`
3. Adiciona índices
4. Gera migration file

**Output esperado:**
```
✔ Your database has been successfully initialized!

✔ Migration `20260414192000_first_migration` created and applied

Start using Prisma Client in Node.js:
const { PrismaClient } = require('@prisma/client')
```

### 4.3 Verificar no MongoDB Atlas

Vá para:

```
Atlas Dashboard
└─ Clusters
   └─ Seu Cluster
      ├─ Browse Collections
      └─ Você verá:
         └─ registro_ocorrencias (banco)
            └─ Incidente (coleção)
```

---

## 5. Testar Conexão

### 5.1 Abrir Prisma Studio

```bash
npm run prisma:studio
```

**Vai abrir em:** http://localhost:5555

Você verá:
- Dashboard do Prisma
- Modelos (Incidente)
- Dados (vazio por enquanto)

### 5.2 Criar um Teste

**Arquivo:** `test-connection.js` (temporário)

```javascript
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Teste 1: Conectar
  console.log('1. Testando conexão...')
  try {
    await prisma.$queryRaw`db.version()`
    console.log('✅ Conexão com MongoDB bem-sucedida!')
  } catch (error) {
    console.log('❌ Erro na conexão:', error.message)
    return
  }

  // Teste 2: Criar Incidente
  console.log('\n2. Criando um incidente de teste...')
  try {
    const incidente = await prisma.incidente.create({
      data: {}
    })
    console.log('✅ Incidente criado:', incidente)
  } catch (error) {
    console.log('❌ Erro ao criar:', error.message)
    return
  }

  // Teste 3: Listar Incidentes
  console.log('\n3. Listando incidentes...')
  try {
    const incidentes = await prisma.incidente.findMany()
    console.log(`✅ Encontrados ${incidentes.length} incidente(s)`)
    console.log(incidentes)
  } catch (error) {
    console.log('❌ Erro ao listar:', error.message)
  }

  await prisma.$disconnect()
}

main().catch(console.error)
```

**Executar:**
```bash
node test-connection.js
```

**Output esperado:**
```
1. Testando conexão...
✅ Conexão com MongoDB bem-sucedida!

2. Criando um incidente de teste...
✅ Incidente criado: { id: '...', createdAt: '...', updatedAt: '...' }

3. Listando incidentes...
✅ Encontrados 1 incidente(s)
```

### 5.3 Testar GraphQL

1. Inicie o servidor:
   ```bash
   npm run dev
   ```

2. Acesse: http://localhost:3000/api/graphql

3. Execute query:
   ```graphql
   query {
     incidentes {
       id
       createdAt
       updatedAt
     }
   }
   ```

4. Você deve receber:
   ```json
   {
     "data": {
       "incidentes": [
         {
           "id": "...",
           "createdAt": "2026-04-14T19:20:00.000Z",
           "updatedAt": "2026-04-14T19:20:00.000Z"
         }
       ]
     }
   }
   ```

✅ **Se chegou aqui, tudo está funcionando!**

---

## Troubleshooting

### ❌ "ENOTFOUND cluster0.xxxxx.mongodb.net"

**Problema:** Connection string incorreta ou internet offline

**Solução:**
```bash
# Verifique a string em .env.local
echo $DATABASE_URL

# Teste conectividade
ping cluster0.xxxxx.mongodb.net
```

### ❌ "authentication failed"

**Problema:** Username ou password incorretos

**Solução:**
1. Verifique credenciais em `.env.local`
2. Vá para Atlas → Security → Database Access
3. Verifique o usuário criado
4. Se necessário, delete e crie novo usuário

### ❌ "no IP whitelisted"

**Problema:** Seu IP não está autorizado

**Solução:**
1. Vá para Atlas → Security → Network Access
2. Adicione seu IP ou use `0.0.0.0/0` para DEV
3. Aguarde ativação (2-3 minutos)

### ❌ "Prisma schema already compiled"

**Problema:** Cache do Prisma

**Solução:**
```bash
# Limpe cache
rm -rf node_modules/.prisma

# Regenere
npm run prisma:generate
```

### ❌ "ECONNREFUSED" com MongoDB local

**Problema:** Ainda conectando em localhost ao invés de Atlas

**Solução:**
```bash
# Verifique conexão
npm run prisma:generate

# Confirme que DATABASE_URL aponta para Atlas
cat .env.local | grep DATABASE_URL
```

---

## 🎯 Checklist de Setup

- [ ] Conta criada no MongoDB Atlas
- [ ] Cluster criado
- [ ] Usuário de banco criado
- [ ] IP adicionado em Network Access
- [ ] Connection string obtida
- [ ] `.env.local` criado com DATABASE_URL
- [ ] `prisma/schema.prisma` atualizado para MongoDB
- [ ] `npm run prisma:generate` executado
- [ ] `npm run prisma:migrate dev --name init` executado
- [ ] Prisma Studio aberto (`npm run prisma:studio`)
- [ ] GraphQL testado
- [ ] Incidente criado e listado com sucesso

---

## 📚 Próximos Passos

1. **Adicionar campos ao Incidente:**
   ```prisma
   model Incidente {
     id        String   @id @default(auto()) @map("_id") @db.ObjectId
     titulo    String
     descricao String?
     status    String   @default("aberto")
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

2. **Executar nova migração:**
   ```bash
   npm run prisma:migrate dev --name add_fields
   ```

3. **Atualizar GraphQL:** Adicionar novos campos aos tipos

---

## 📖 Documentação Útil

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Prisma MongoDB Guide](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [Prisma Migration Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

## 💬 Dúvidas?

Se encontrar problemas, verifique:
1. `.env.local` existe e tem DATABASE_URL correto?
2. IP está adicionado no Network Access?
3. Usuário foi criado com sucesso?
4. Connection string tem nome do banco?

Good luck! 🚀
