# Frontend - Registro de Ocorrências

Frontend clean e minimalista desenvolvido com **Next.js 14**, **React** e componentes **Tailwind CSS**.

## 📋 Estrutura

```
app/
├── page.tsx                          # Raiz (redireciona para /painel)
├── login/page.tsx                    # Página de Login
├── painel/
│   ├── layout.tsx                    # Layout do painel com sidebar
│   ├── page.tsx                      # Dashboard
│   └── mecanica/page.tsx             # Ordem de Serviço (Incidentes)
components/
├── Sidebar.tsx                       # Menu lateral do painel
```

## 🚀 Como Executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Edite `.env.local`:
```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3333/graphql
```

### 3. Iniciar servidor de desenvolvimento
```bash
npm run dev
```

Acesse em: **http://localhost:3666**

---

## 📄 Páginas

### Login (`/login`)
- Layout split: imagem do lado esquerdo, formulário do lado direito
- Campos: Email, Senha
- TODO: Integrar com backend de autenticação

### Painel (`/painel`)
- Sidebar com menu de módulos
- Dashboard vazio (bem-vindo)

### Ordem de Serviço (`/painel/mecanica`)
- Tabela de ordens de serviço (incidentes)
- Filtros: Busca, tipo, status
- Botão para criar nova ordem
- Modal de criação
- TODO: Conectar com GraphQL backend

---

## 🔗 Integração GraphQL

Para ativar a integração com o backend:

1. **Criar hook de GraphQL** (`hooks/use-graphql.ts`)
2. **Atualizar página de login** para chamar mutation `login`
3. **Atualizar página de ordem de serviço** para usar queries/mutations

---

## 🎨 Estilos

- **Framework CSS**: Tailwind CSS
- **Ícones**: Lucide React
- **Cores**: Paleta simples (azul, cinza, branco)

---

## 📝 TODO

- [ ] Integrar autenticação GraphQL
- [ ] Conectar queries/mutations de Incidente
- [ ] Adicionar componentes shadcn conforme necessário
- [ ] Melhorar responsividade mobile
- [ ] Adicionar validações de formulário
- [ ] Adicionar toast notifications

---

**Última atualização**: 16/04/2026
