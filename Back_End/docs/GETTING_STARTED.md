# Guia de Inicialização

Este guia fornece os passos para configurar e executar o projeto Backend.

## Pré-requisitos

- **Node.js** versão 18 ou superior
- **npm** ou **yarn** como gerenciador de pacotes
- **PostgreSQL** para o banco de dados (ou outro banco compatível com Prisma)

## Passos de Instalação

### 1. Instalar Node.js

Faça download de [nodejs.org](https://nodejs.org/) e instale. Depois, abra um novo terminal e verifique:

```bash
node --version
npm --version
```

### 2. Instalar Dependências

Na pasta `Back_End`, execute:

```bash
npm install
```

Este comando instalará todos os pacotes do `package.json`.

### 3. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite `.env.local` e configure o `DATABASE_URL`:
   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/registro_ocorrencias"
   ```

   > Substitua `usuario`, `senha` e os demais valores conforme sua configuração do PostgreSQL.

### 4. Gerar Prisma Client

```bash
npm run prisma:generate
```

### 5. Executar Migrações

```bash
npm run prisma:migrate
```

Este comando criará as tabelas no banco de dados conforme definido em `prisma/schema.prisma`.

## Executar o Projeto

```bash
npm run dev
```

O servidor estará disponível em **http://localhost:3000**

## Acessar Endpoints

- **Home:** http://localhost:3000
- **GraphQL Playground:** http://localhost:3000/api/graphql
- **Swagger UI:** http://localhost:3000/api-docs

## Próximas Etapas

- Configure os atributos do modelo `Incidente` conforme suas necessidades
- Adicione validações nos DTOs
- Implemente autenticação e autorização quando necessário
- Configure testes unitários e de integração

## Troubleshoot

### Erro: "Port 3000 is already in use"

Use uma porta diferente:
```bash
npm run dev -- -p 3001
```

### Erro: "DATABASE_URL not set"

Certifique-se de que `.env.local` está configurado corretamente e localizado na raiz do projeto.

### Erro de conexão com banco de dados

Verifique:
- Se o PostgreSQL está rodando
- Se as credenciais no `DATABASE_URL` estão corretas
- Se o banco de dados existe

Para mais ajuda, consulte:
- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Prisma](https://www.prisma.io/docs/)
- [Documentação Apollo GraphQL](https://www.apollographql.com/docs/)
